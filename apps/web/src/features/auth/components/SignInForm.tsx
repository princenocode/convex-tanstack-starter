import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@my-sample/ui';
import { credentialsSchema, type CredentialsInput } from '../lib/schema';
import { useAuth } from '../hooks/useAuth';

type Mode = 'sign-in' | 'sign-up';

// Email + password form (§6: RHF + zod resolver). Presentation only — the auth
// calls go through the `useAuth` interface.
export function SignInForm() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('sign-in');
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CredentialsInput>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const action = mode === 'sign-in' ? signIn(values) : signUp(values);
    const { error } = await action;
    if (error) {
      setServerError(error.message ?? 'Authentication failed');
    }
  });

  const isSignUp = mode === 'sign-up';

  return (
    <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-sm flex-col gap-3">
      <h1 className="text-xl font-semibold">{isSignUp ? 'Create account' : 'Sign in'}</h1>

      {isSignUp && (
        <Field label="Name" error={form.formState.errors.name?.message}>
          <input className={inputClass} autoComplete="name" {...form.register('name')} />
        </Field>
      )}

      <Field label="Email" error={form.formState.errors.email?.message}>
        <input
          className={inputClass}
          type="email"
          autoComplete="email"
          {...form.register('email')}
        />
      </Field>

      <Field label="Password" error={form.formState.errors.password?.message}>
        <input
          className={inputClass}
          type="password"
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          {...form.register('password')}
        />
      </Field>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {isSignUp ? 'Sign up' : 'Sign in'}
      </Button>

      <button
        type="button"
        className="text-sm text-zinc-500 underline"
        onClick={() => setMode(isSignUp ? 'sign-in' : 'sign-up')}
      >
        {isSignUp ? 'Have an account? Sign in' : 'Need an account? Sign up'}
      </button>
    </form>
  );
}

const inputClass = 'h-10 rounded-md border border-zinc-300 px-3 text-sm';

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
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label}
      {children}
      {error && <span className="font-normal text-red-600">{error}</span>}
    </label>
  );
}
