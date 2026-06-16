// Sign-up password policy — the single source of truth shared by the zod schema
// (which gates submission) and the PasswordStrength indicator (which gives live
// feedback). Keep the two in sync by depending on `passwordRules` here.

export type PasswordRule = { label: string; test: (value: string) => boolean };

export const passwordRules: PasswordRule[] = [
  { label: 'Be at least 8 characters long', test: (v) => v.length >= 8 },
  { label: 'At least one uppercase letter (A-Z)', test: (v) => /[A-Z]/.test(v) },
  { label: 'At least one lowercase letter (a-z)', test: (v) => /[a-z]/.test(v) },
  { label: 'At least one number (0-9)', test: (v) => /[0-9]/.test(v) },
  { label: 'At least one special character (!@#$%^&*)', test: (v) => /[!@#$%^&*]/.test(v) },
];

export type PasswordStrength = 'weak' | 'medium' | 'strong';
export type PasswordRequirement = { label: string; met: boolean };
export type PasswordAssessment = {
  requirements: PasswordRequirement[];
  score: number; // count of satisfied rules
  strength: PasswordStrength;
};

export function assessPassword(value: string): PasswordAssessment {
  const requirements = passwordRules.map((rule) => ({ label: rule.label, met: rule.test(value) }));
  const score = requirements.filter((r) => r.met).length;
  const strength: PasswordStrength =
    score <= 2 ? 'weak' : score < passwordRules.length ? 'medium' : 'strong';
  return { requirements, score, strength };
}

export function meetsAllPasswordRules(value: string): boolean {
  return passwordRules.every((rule) => rule.test(value));
}
