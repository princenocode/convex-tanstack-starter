import type { Doc, Id } from '@my-sample/backend/dataModel';
import { Button } from '@my-sample/ui';

type TaskListProps = {
  tasks: Doc<'tasks'>[];
  onToggle: (id: Id<'tasks'>, isCompleted: boolean) => void;
  onRemove: (id: Id<'tasks'>) => void;
};

// Pure presentation: same props → same render (§4).
export function TaskList({ tasks, onToggle, onRemove }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-sm text-zinc-500">No tasks yet — add your first one above.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <li
          key={task._id}
          className="flex items-center gap-3 rounded-md border border-zinc-200 p-2"
        >
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={(event) => onToggle(task._id, event.target.checked)}
            aria-label={`Mark "${task.title}" as ${task.isCompleted ? 'incomplete' : 'complete'}`}
          />
          <span className={task.isCompleted ? 'flex-1 text-zinc-400 line-through' : 'flex-1'}>
            {task.title}
          </span>
          <Button variant="ghost" size="sm" onClick={() => onRemove(task._id)}>
            Delete
          </Button>
        </li>
      ))}
    </ul>
  );
}
