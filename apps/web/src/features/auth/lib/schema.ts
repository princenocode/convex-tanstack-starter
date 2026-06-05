import { z } from 'zod';

// Auth-specific shapes are local to this feature (not shared) — only the auth
// UI needs them.
export const credentialsSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type CredentialsInput = z.infer<typeof credentialsSchema>;
