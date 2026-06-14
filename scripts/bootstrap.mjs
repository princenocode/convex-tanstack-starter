#!/usr/bin/env node
// One-command project bootstrap (`pnpm bootstrap`).
//
// Installs dependencies, provisions/links a Convex deployment, generates and
// pushes the Convex-side secrets, and writes apps/web/.env.local — so a fresh
// clone of this template is runnable with a single command.
//
// Dependency-free on purpose: it runs against a clone with no node_modules yet,
// so it uses Node built-ins only.

import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BACKEND_DIR = join(ROOT, 'packages', 'backend');
const BACKEND_ENV = join(BACKEND_DIR, '.env.local');
const WEB_ENV = join(ROOT, 'apps', 'web', '.env.local');
const SITE_URL = 'http://localhost:3000';

const rl = createInterface({ input: process.stdin, output: process.stdout });

// --- small helpers ----------------------------------------------------------

const c = {
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

let step = 0;
function banner(title) {
  step += 1;
  console.log(`\n${c.bold(c.green(`[${step}] ${title}`))}`);
}

function fail(message) {
  console.error(`\n${c.red('✖')} ${message}`);
  rl.close();
  process.exit(1);
}

async function ask(question, fallback = '') {
  const suffix = fallback ? c.dim(` (${fallback})`) : '';
  const answer = (await rl.question(`${question}${suffix} `)).trim();
  return answer || fallback;
}

async function confirm(question, defaultYes = false) {
  const hint = defaultYes ? 'Y/n' : 'y/N';
  const answer = (await rl.question(`${question} ${c.dim(`(${hint})`)} `)).trim().toLowerCase();
  if (!answer) return defaultYes;
  return answer === 'y' || answer === 'yes';
}

// Run a command inheriting stdio (so Convex login / prompts work). Returns the
// exit status; throws on spawn failure only.
function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', cwd: ROOT, shell: false, ...opts });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

function runOrFail(cmd, args, opts = {}) {
  if (run(cmd, args, opts) !== 0) {
    fail(`Command failed: ${cmd} ${args.join(' ')}`);
  }
}

function readEnv(filePath) {
  if (!existsSync(filePath)) return {};
  const env = {};
  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

// Merge `record` into an existing env file, overwriting matching keys and
// keeping unrelated lines. Idempotent: re-running never duplicates lines.
function upsertEnv(filePath, record, header = '') {
  const lines = existsSync(filePath) ? readFileSync(filePath, 'utf8').split('\n') : [];
  const remaining = { ...record };

  const out = lines.map((line) => {
    const eq = line.indexOf('=');
    if (eq === -1 || line.trim().startsWith('#')) return line;
    const key = line.slice(0, eq).trim();
    if (key in remaining) {
      const value = remaining[key];
      delete remaining[key];
      return `${key}=${value}`;
    }
    return line;
  });

  const additions = Object.entries(remaining).map(([k, v]) => `${k}=${v}`);
  let content = out.join('\n');
  if (additions.length) {
    if (content && !content.endsWith('\n')) content += '\n';
    if (!content && header) content = `${header}\n`;
    content += `${additions.join('\n')}\n`;
  }
  if (content && !content.endsWith('\n')) content += '\n';
  writeFileSync(filePath, content);
}

function deriveSiteUrl(cloudUrl) {
  return cloudUrl.replace(/\.convex\.cloud(\/?)$/, '.convex.site$1').replace(/\/$/, '');
}

function isValidConvexUrl(url) {
  return /^https:\/\/[a-z0-9-]+\.convex\.cloud\/?$/.test(url);
}

// Find the deployment .cloud URL Convex wrote (key name varies by CLI version).
function resolveConvexUrl(env) {
  return env.CONVEX_URL || env.VITE_CONVEX_URL || env.CONVEX_CLOUD_URL || '';
}

// Run Convex with non-interactive flags, falling back to the plain interactive
// form (which always works) if the installed CLI rejects the flags.
function convexProvision(extraArgs) {
  const flagged = run('npx', ['convex', 'dev', '--once', ...extraArgs], { cwd: BACKEND_DIR });
  if (flagged === 0) return;
  console.log(c.yellow('\nFalling back to interactive `npx convex dev` …\n'));
  runOrFail('npx', ['convex', 'dev', '--once'], { cwd: BACKEND_DIR });
}

// --- steps ------------------------------------------------------------------

function preflight() {
  banner('Checking prerequisites');
  const major = Number(process.versions.node.split('.')[0]);
  if (major < 22) fail(`Node 22+ required, found ${process.versions.node}.`);
  const pnpm = spawnSync('pnpm', ['--version'], { encoding: 'utf8' });
  if (pnpm.status !== 0) fail('pnpm not found on PATH. Install pnpm 10+ first (https://pnpm.io).');
  console.log(`Node ${process.versions.node}, pnpm ${pnpm.stdout.trim()} ✓`);
}

function install() {
  banner('Installing dependencies');
  runOrFail('pnpm', ['install']);
}

async function setupConvex() {
  banner('Convex deployment');

  const existingEnv = readEnv(BACKEND_ENV);
  if (existingEnv.CONVEX_DEPLOYMENT && resolveConvexUrl(existingEnv)) {
    const reuse = await confirm(
      `Found a linked deployment (${c.dim(existingEnv.CONVEX_DEPLOYMENT)}). Reuse it?`,
      true,
    );
    if (reuse) {
      console.log('Reusing existing deployment, regenerating Convex API …');
      runOrFail('npx', ['convex', 'codegen'], { cwd: BACKEND_DIR });
      return { canSetSecrets: true };
    }
  }

  const hasProject = await confirm('Do you already have a Convex project for this app?', false);

  if (!hasProject) {
    let name = await ask('New Convex project name?', 'my-sample');
    while (!/^[a-z0-9-]+$/.test(name)) {
      console.log(c.yellow('Use lowercase letters, digits and hyphens only.'));
      name = await ask('New Convex project name?', 'my-sample');
    }
    console.log('Creating the Convex project (a browser window may open to log in) …');
    convexProvision(['--configure=new', '--project', name]);
    return { canSetSecrets: true };
  }

  console.log('\nHow do you want to connect the existing project?');
  console.log(`  ${c.bold('1')}) Re-link via Convex login (pull credentials automatically)`);
  console.log(`  ${c.bold('2')}) Paste the values manually (fill the missing env)`);
  const choice = await ask('Choose 1 or 2', '1');

  if (choice === '2') {
    let url = await ask('VITE_CONVEX_URL (https://<deployment>.convex.cloud)');
    while (!isValidConvexUrl(url)) {
      console.log(c.yellow('Expected a URL like https://happy-animal-123.convex.cloud'));
      url = await ask('VITE_CONVEX_URL');
    }
    const deployment = await ask('CONVEX_DEPLOYMENT (optional, press Enter to skip)');
    const record = { CONVEX_URL: url };
    if (deployment) record.CONVEX_DEPLOYMENT = deployment;
    upsertEnv(BACKEND_ENV, record);
    console.log('Generating the Convex API from the linked deployment …');
    runOrFail('npx', ['convex', 'codegen'], { cwd: BACKEND_DIR });
    const canSetSecrets = await confirm(
      'Do you have deploy access to set Convex-side secrets on this project?',
      true,
    );
    return { canSetSecrets };
  }

  console.log('Re-linking the existing project (a browser window may open to log in) …');
  convexProvision(['--configure=existing']);
  return { canSetSecrets: true };
}

function writeWebEnv() {
  banner('Writing apps/web/.env.local');
  const backendEnv = readEnv(BACKEND_ENV);
  const cloudUrl = resolveConvexUrl(backendEnv).replace(/\/$/, '');
  if (!cloudUrl) {
    fail(
      `Could not find the Convex deployment URL in ${BACKEND_ENV}.\n` +
        'Run `cd packages/backend && npx convex dev` once, then re-run `pnpm bootstrap`.',
    );
  }

  const header =
    '# Local web env — public Convex URLs only. Secrets live on Convex (see .env.example).';
  upsertEnv(
    WEB_ENV,
    {
      VITE_CONVEX_URL: cloudUrl,
      VITE_CONVEX_SITE_URL: deriveSiteUrl(cloudUrl),
      VITE_SITE_URL: SITE_URL,
    },
    header,
  );
  console.log(`VITE_CONVEX_URL=${cloudUrl}`);
  console.log(`VITE_CONVEX_SITE_URL=${deriveSiteUrl(cloudUrl)}`);
  console.log(`VITE_SITE_URL=${SITE_URL}`);
}

function setSecrets(canSetSecrets) {
  banner('Setting Convex-side secrets');
  const secret = randomBytes(32).toString('base64');

  if (!canSetSecrets) {
    console.log(c.yellow('Skipping automatic secret setup. Run these yourself when ready:'));
    console.log(c.dim(`  cd packages/backend`));
    console.log(c.dim(`  npx convex env set BETTER_AUTH_SECRET "${secret}"`));
    console.log(c.dim(`  npx convex env set SITE_URL ${SITE_URL}`));
    return;
  }

  const ok =
    run('npx', ['convex', 'env', 'set', 'BETTER_AUTH_SECRET', secret], { cwd: BACKEND_DIR }) ===
      0 && run('npx', ['convex', 'env', 'set', 'SITE_URL', SITE_URL], { cwd: BACKEND_DIR }) === 0;

  if (ok) {
    console.log('BETTER_AUTH_SECRET and SITE_URL set on the deployment ✓');
  } else {
    console.log(c.yellow('\nCould not set secrets automatically. Run these manually:'));
    console.log(c.dim(`  cd packages/backend`));
    console.log(c.dim(`  npx convex env set BETTER_AUTH_SECRET "${secret}"`));
    console.log(c.dim(`  npx convex env set SITE_URL ${SITE_URL}`));
  }
}

function done() {
  console.log(`\n${c.bold(c.green('✓ Bootstrap complete.'))}`);
  console.log(`\nNext:`);
  console.log(`  ${c.bold('pnpm dev')}   ${c.dim('→ app on http://localhost:3000')}`);
  console.log(c.dim('\nRe-running `pnpm bootstrap` is safe (idempotent).'));
}

// --- main -------------------------------------------------------------------

try {
  console.log(c.bold('\nmy-sample bootstrap\n'));
  preflight();
  install();
  const { canSetSecrets } = await setupConvex();
  writeWebEnv();
  setSecrets(canSetSecrets);
  done();
} catch (err) {
  fail(err?.message ?? String(err));
} finally {
  rl.close();
}
