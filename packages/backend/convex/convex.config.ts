import { defineApp } from 'convex/server';
import betterAuth from '@convex-dev/better-auth/convex.config';

// Register the Better Auth component (§7). Its tables/functions live inside the
// component, isolated from app tables.
const app = defineApp();
app.use(betterAuth);

export default app;
