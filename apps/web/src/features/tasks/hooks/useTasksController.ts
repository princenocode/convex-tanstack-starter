import type { Id } from '@my-sample/backend/dataModel';
import { useTasks } from '../api/useTasks';
import { useCreateTask, useRemoveTask, useSetTaskCompleted } from '../api/useTaskMutations';

// Orchestration lives in a hook; components stay presentational (§4).
export function useTasksController() {
  const tasksQuery = useTasks();
  const createTask = useCreateTask();
  const setCompleted = useSetTaskCompleted();
  const removeTask = useRemoveTask();

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isPending,
    createTask: (title: string) => createTask({ title }),
    toggleTask: (taskId: Id<'tasks'>, isCompleted: boolean) =>
      setCompleted({ taskId, isCompleted }),
    removeTask: (taskId: Id<'tasks'>) => removeTask({ taskId }),
  };
}
