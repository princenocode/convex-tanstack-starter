// Re-export the shared `cn` so shadcn components (which import `#/lib/utils`)
// and feature code share one implementation (§6). The source lives in
// @convex-tanstack-starter/ui.
export { cn } from '@convex-tanstack-starter/ui';
