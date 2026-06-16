import { describe, expect, it } from 'vitest';
import { assessPassword, meetsAllPasswordRules } from './password';

describe('assessPassword', () => {
  it('treats an empty password as weak with nothing met', () => {
    const a = assessPassword('');
    expect(a.score).toBe(0);
    expect(a.strength).toBe('weak');
    expect(a.requirements.every((r) => !r.met)).toBe(true);
  });

  it('marks only the lowercase rule for "abc"', () => {
    const a = assessPassword('abc');
    expect(a.score).toBe(1);
    expect(a.strength).toBe('weak');
    expect(a.requirements.find((r) => r.label.includes('lowercase'))?.met).toBe(true);
  });

  it('rates a password missing the special char as medium', () => {
    const a = assessPassword('Abcdefg1'); // 8 chars, upper, lower, number — no special
    expect(a.score).toBe(4);
    expect(a.strength).toBe('medium');
  });

  it('rates a password meeting every rule as strong', () => {
    const a = assessPassword('Abcdef1!');
    expect(a.score).toBe(5);
    expect(a.strength).toBe('strong');
  });
});

describe('meetsAllPasswordRules', () => {
  it('is true only when every rule passes', () => {
    expect(meetsAllPasswordRules('Abcdef1!')).toBe(true);
    expect(meetsAllPasswordRules('abc')).toBe(false);
    expect(meetsAllPasswordRules('Abcdefg1')).toBe(false);
  });
});
