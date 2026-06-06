import type { CreateTaskInput } from '@my-sample/shared';

// Pure business logic (§5): no DB access, fully unit-testable. The handler
// orchestrates; this builds the row.
export type NewTask = {
  userId: string;
  title: string;
  isCompleted: boolean;
};

export function buildTask(userId: string, input: CreateTaskInput): NewTask {
  return {
    userId,
    title: input.title.trim(),
    isCompleted: false,
  };
}
