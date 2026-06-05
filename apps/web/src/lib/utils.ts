// Re-export the shared `cn` so shadcn components (which import `#/lib/utils`)
// and feature code share one implementation (§6). The source lives in
// @my-sample/ui.
export { cn } from '@my-sample/ui';
