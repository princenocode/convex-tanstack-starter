import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaskSchema, type CreateTaskInput } from '@convex-tanstack-starter/shared';
import { Button } from '@convex-tanstack-starter/ui';

type TaskComposerProps = {
  onCreate: (title: string) => Promise<unknown>;
};

// The form schema IS the shared Zod schema (§6) — one source of truth, reused
// by the backend.
export function TaskComposer({ onCreate }: TaskComposerProps) {
  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { title: '' },
  });

  const onSubmit = form.handleSubmit(async ({ title }) => {
    await onCreate(title);
    form.reset();
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-1">
      <div className="flex gap-2">
        <input
          className="h-10 flex-1 rounded-md border border-zinc-300 px-3 text-sm"
          placeholder="Add a task…"
          aria-label="Task title"
          {...form.register('title')}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Add
        </Button>
      </div>
      {form.formState.errors.title && (
        <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
      )}
    </form>
  );
}
