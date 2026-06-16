import { z } from 'zod';
import { meetsAllPasswordRules } from './password';

// Auth form shapes are local to this feature (not shared) — only the auth UI
// needs them. Sign-in just needs a non-empty password; sign-up additionally
// needs a name and a password that satisfies the full policy (see password.ts).
export const signInSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().refine(meetsAllPasswordRules, 'Password does not meet all the requirements'),
});

// The form holds the superset of fields; `name` is unused in sign-in mode.
export type CredentialsInput = z.infer<typeof signUpSchema>;
