import { z } from 'zod';

// Single source of truth for the Task shape (§6). The Convex backend validates
// against this in its business logic, and the web form derives its RHF schema
// from it — types are inferred, never duplicated.
export const taskTitleSchema = z
  .string()
  .trim()
  .min(1, 'Title is required')
  .max(200, 'Title must be at most 200 characters');

export const createTaskSchema = z.object({
  title: taskTitleSchema,
});

export const taskSchema = createTaskSchema.extend({
  isCompleted: z.boolean(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type Task = z.infer<typeof taskSchema>;
