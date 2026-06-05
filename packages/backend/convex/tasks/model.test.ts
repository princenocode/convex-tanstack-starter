import { describe, it, expect } from 'vitest';
import { buildTask } from './model';

describe('buildTask', () => {
  it('creates an incomplete task owned by the given user', () => {
    expect(buildTask('user_123', { title: 'Write the plan' })).toEqual({
      userId: 'user_123',
      title: 'Write the plan',
      isCompleted: false,
    });
  });

  it('trims surrounding whitespace from the title', () => {
    expect(buildTask('user_123', { title: '   Buy milk   ' }).title).toBe('Buy milk');
  });
});
