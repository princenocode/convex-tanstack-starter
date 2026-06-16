import { z } from 'zod';

// Single source of truth for the app-level user shape (§6). Better Auth owns the
// base identity (id, email, name); the fields here are the application's default
// user schema, layered on via `additionalFields` in the backend auth config and
// deployed with the first `pnpm bootstrap`.

// Roles a user can hold. New sign-ups default to `operator`; `admin` is granted
// out-of-band and is never settable from the client.
export const userRoleSchema = z.enum(['admin', 'operator']);

export type UserRole = z.infer<typeof userRoleSchema>;

// Default role assigned to every new account (kept here so the backend auth
// config and the frontend agree on one value).
export const DEFAULT_USER_ROLE: UserRole = 'operator';

// The user profile the client may read: the Better Auth identity plus the app's
// custom fields.
export const userProfileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().email(),
  role: userRoleSchema,
});

export type UserProfile = z.infer<typeof userProfileSchema>;
