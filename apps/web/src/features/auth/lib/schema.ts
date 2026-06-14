import { z } from 'zod';

// Auth form shapes are local to this feature (not shared) — only the auth UI
// needs them. Sign-in needs email + password; sign-up additionally needs a name.
export const signInSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signUpSchema = signInSchema.extend({
  name: z.string().trim().min(1, 'Name is required'),
});

// The form holds the superset of fields; `name` is unused in sign-in mode.
export type CredentialsInput = z.infer<typeof signUpSchema>;
