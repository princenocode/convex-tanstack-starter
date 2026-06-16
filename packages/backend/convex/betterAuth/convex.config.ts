import { defineComponent } from 'convex/server';

// Local install of the Better Auth component (vendored). Vendoring lets the
// component's `user` table carry the app's custom `role` field (§6) — the
// published component's schema is fixed and would reject it. See ./schema.ts and
// ./adapter.ts; the rest of the backend still only touches ../auth.ts.
const component = defineComponent('betterAuth');

export default component;
