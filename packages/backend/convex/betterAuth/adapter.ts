import { createApi } from '@convex-dev/better-auth';
import schema from './schema';
import { createAuthOptions } from '../auth.options';

/**
 * Database functions exposed by the vendored Better Auth component (local
 * install). `createApi` builds each model's argument validator directly from
 * `schema.tables[model]`, so the `role` field added to the user table in
 * ./schema.ts is what makes the component accept `role` on user creation. The
 * options callback is used only to derive unique-field metadata.
 *
 * The exported set mirrors the published component adapter — the client
 * (../auth.ts → convexAdapter) calls all seven.
 */
export const { create, findOne, findMany, updateOne, updateMany, deleteOne, deleteMany } =
  createApi(schema, () => createAuthOptions());
