import { useState, type ComponentType } from 'react';
import { useForm, type Resolver, type UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Layers, Loader2, Lock, Mail, User } from 'lucide-react';
import { Button } from '@convex-tanstack-starter/ui';
import { signInSchema, signUpSchema, type CredentialsInput } from '../lib/schema';
import { useAuth } from '../hooks/useAuth';
import { PasswordStrength } from './PasswordStrength';

type Mode = 'sign-in' | 'sign-up';

// Email + password auth card (§6: RHF + zod resolver). Presentation only — the
// auth calls go through the `useAuth` interface. Renders both sign-in and
// sign-up (one toggle) so it covers the whole credential flow.
export function SignInForm() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('sign-in');
  const [serverError, setServerError] = useState<string | null>(null);
  const isSignUp = mode === 'sign-up';

  const form = useForm<CredentialsInput>({
    // Resolver tracks the mode: sign-in skips the name requirement. The form
    // always holds the superset of fields, so we type it as CredentialsInput.
    resolver: zodResolver(
      isSignUp ? signUpSchema : signInSchema,
    ) as unknown as Resolver<CredentialsInput>,
    defaultValues: { name: '', email: '', password: '' },
  });

  // Live password value drives the sign-up strength indicator.
  const password = form.watch('password');

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const { error } = isSignUp ? await signUp(values) : await signIn(values);
    if (error) setServerError(error.message ?? 'Authentication failed');
  });

  function toggleMode() {
    setServerError(null);
    setMode(isSignUp ? 'sign-in' : 'sign-up');
  }

  return (
    <div className="island-shell mx-auto w-full max-w-md rounded-3xl p-8 sm:p-10">
      <AuthHeader isSignUp={isSignUp} />

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5" noValidate>
        {isSignUp && (
          <Field label="Name" error={form.formState.errors.name?.message}>
            <InputWithIcon icon={User}>
              <input
                className={inputClass}
                autoComplete="name"
                placeholder="Jane Doe"
                {...form.register('name')}
              />
            </InputWithIcon>
          </Field>
        )}

        <Field label="Email" error={form.formState.errors.email?.message}>
          <InputWithIcon icon={Mail}>
            <input
              className={inputClass}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...form.register('email')}
            />
          </InputWithIcon>
        </Field>

        <Field
          label="Password"
          error={isSignUp ? undefined : form.formState.errors.password?.message}
        >
          <PasswordInput register={form.register('password')} isSignUp={isSignUp} />
        </Field>

        {isSignUp && <PasswordStrength value={password} />}

        {serverError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</p>
        )}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="h-11 w-full rounded-xl bg-[var(--lagoon-deep)] text-base font-semibold text-white hover:bg-[color-mix(in_oklab,var(--lagoon-deep)_88%,black)]"
        >
          {form.formState.isSubmitting && (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {isSignUp ? 'Sign up' : 'Sign in'}
        </Button>
      </form>

      <button
        type="button"
        className="mt-6 w-full text-center text-sm text-[var(--sea-ink-soft)] underline underline-offset-4 transition-colors hover:text-[var(--sea-ink)]"
        onClick={toggleMode}
      >
        {isSignUp ? 'Have an account? Sign in' : 'Need an account? Sign up'}
      </button>
    </div>
  );
}

const inputClass =
  'h-11 w-full rounded-xl border border-[var(--line)] bg-white/70 pl-10 pr-3 text-sm text-[var(--sea-ink)] outline-none transition-colors placeholder:text-[var(--sea-ink-soft)]/55 focus:border-[var(--lagoon-deep)] focus:ring-2 focus:ring-[var(--lagoon)]/30';

// Brand badge, title and subtitle at the top of the card.
function AuthHeader({ isSignUp }: { isSignUp: boolean }) {
  return (
    <header className="flex flex-col items-center gap-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--lagoon)] to-[var(--palm)] text-white shadow-lg shadow-[rgba(47,106,74,0.32)]">
        <Layers className="h-7 w-7" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <h1 className="display-title text-2xl font-semibold text-[var(--sea-ink)]">
          {isSignUp ? 'Create account' : 'Sign in'}
        </h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          {isSignUp ? 'Set up your operator account' : 'Sign in to your account'}
        </p>
      </div>
    </header>
  );
}

// Password input with a show/hide toggle.
function PasswordInput({
  register,
  isSignUp,
}: {
  register: UseFormRegisterReturn;
  isSignUp: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <InputWithIcon icon={Lock}>
      <input
        className={`${inputClass} pr-10`}
        type={show ? 'text' : 'password'}
        autoComplete={isSignUp ? 'new-password' : 'current-password'}
        placeholder="••••••••"
        {...register}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--sea-ink-soft)] transition-colors hover:text-[var(--sea-ink)]"
      >
        {show ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </InputWithIcon>
  );
}

// Field wraps a control with its label and inline error message.
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--sea-ink)]">
      {label}
      {children}
      {error && <span className="font-normal text-red-600">{error}</span>}
    </label>
  );
}

// Positions a leading lucide icon inside the input box; children render on top.
function InputWithIcon({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Icon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]"
        aria-hidden
      />
      {children}
    </div>
  );
}
