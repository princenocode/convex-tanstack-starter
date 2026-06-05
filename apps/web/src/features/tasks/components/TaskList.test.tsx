import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskList } from './TaskList';

type TasksProp = Parameters<typeof TaskList>[0]['tasks'];

// Mock rows shaped like Doc<'tasks'> without importing the generated type.
const mockTasks = [
  { _id: 't1', _creationTime: 0, userId: 'u', title: 'First task', isCompleted: false },
  { _id: 't2', _creationTime: 0, userId: 'u', title: 'Second task', isCompleted: true },
] as unknown as TasksProp;

const noop = () => undefined;

describe('TaskList', () => {
  it('shows an empty state when there are no tasks', () => {
    render(<TaskList tasks={[] as unknown as TasksProp} onToggle={noop} onRemove={noop} />);
    expect(screen.getByText(/no tasks yet/i)).toBeTruthy();
  });

  it('renders one row per task', () => {
    render(<TaskList tasks={mockTasks} onToggle={noop} onRemove={noop} />);
    expect(screen.getByText('First task')).toBeTruthy();
    expect(screen.getByText('Second task')).toBeTruthy();
  });
});
