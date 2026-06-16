import { defineApp } from 'convex/server';
import betterAuth from './betterAuth/convex.config';

// Register the Better Auth component (§7). We use a LOCAL (vendored) install of
// the component — ./betterAuth — so its `user` table can carry the app's custom
// `role` field (§6). Its tables/functions live inside the component, isolated
// from app tables.
const app = defineApp();
app.use(betterAuth);

export default app;
