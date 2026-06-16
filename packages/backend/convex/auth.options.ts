import { convex } from '@convex-dev/better-auth/plugins';
import type { BetterAuthOptions } from 'better-auth/minimal';
import { DEFAULT_USER_ROLE } from '@convex-tanstack-starter/shared';
import authConfig from './auth.config';

/**
 * Static Better Auth options, shared by the runtime auth instance (`createAuth`
 * in ./auth.ts) and the vendored component adapter (./betterAuth/adapter.ts).
 *
 * It carries NO Convex ctx, generated API, or required env access, so the
 * component bundle can import it safely: the component's `createApi` evaluates
 * these options at module load (via `getAuthTables`) to derive unique-field
 * metadata. `database` and the request `baseURL` are layered on per-request in
 * `createAuth`.
 *
 * The app-level `role` (§6) is declared here through `additionalFields`.
 * `input: false` keeps it server-controlled — the client can never set or
 * escalate it at sign-up; new users default to `operator`. For the component's
 * validator to ACCEPT this field, it must also exist in the vendored schema
 * (./betterAuth/schema.ts) — both are kept in sync by hand.
 */
export const createAuthOptions = () =>
  ({
    baseURL: process.env.SITE_URL,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    user: {
      additionalFields: {
        role: {
          type: 'string',
          required: false,
          input: false,
          defaultValue: DEFAULT_USER_ROLE,
        },
      },
    },
    plugins: [convex({ authConfig })],
  }) satisfies BetterAuthOptions;
