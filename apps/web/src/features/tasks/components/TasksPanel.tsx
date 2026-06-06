import { Spinner } from '@my-sample/ui';
import { useTasksController } from '../hooks/useTasksController';
import { TaskComposer } from './TaskComposer';
import { TaskList } from './TaskList';

// Thin container: wires the controller hook to presentational components.
export function TasksPanel() {
  const { tasks, isLoading, createTask, toggleTask, removeTask } = useTasksController();

  return (
    <section className="flex flex-col gap-4">
      <TaskComposer onCreate={createTask} />
      {isLoading ? (
        <Spinner label="Loading tasks" />
      ) : (
        <TaskList tasks={tasks} onToggle={toggleTask} onRemove={removeTask} />
      )}
    </section>
  );
}
