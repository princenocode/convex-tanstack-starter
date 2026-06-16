import { Check, X } from 'lucide-react';
import { assessPassword, type PasswordStrength as Strength } from '../lib/password';

// Live password feedback for sign-up: a strength bar plus the requirement
// checklist. Reads from `assessPassword`, the same policy the schema enforces.
const STRENGTH: Record<Strength, { label: string; color: string }> = {
  weak: { label: 'Weak', color: '#dc2626' },
  medium: { label: 'Medium', color: '#d97706' },
  strong: { label: 'Strong', color: '#16a34a' },
};

export function PasswordStrength({ value }: { value: string }) {
  // Only surface the policy once the user starts typing — an empty, all-failing
  // checklist on focus reads as discouraging.
  if (value.length === 0) return null;

  const { requirements, score, strength } = assessPassword(value);
  const meta = STRENGTH[strength];
  const percent = Math.round((score / requirements.length) * 100);

  return (
    <div className="mt-1 flex flex-col gap-2">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold" style={{ color: meta.color }}>
          {meta.label}
        </span>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full"
          style={{ background: 'var(--chip-line)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${percent}%`, background: meta.color }}
          />
        </div>
      </div>
      <ul className="flex flex-col gap-1">
        {requirements.map((rule) => (
          <li
            key={rule.label}
            className={`flex items-center gap-2 text-xs ${rule.met ? 'font-medium' : ''}`}
            style={{ color: rule.met ? 'var(--sea-ink)' : 'var(--sea-ink-soft)' }}
          >
            {rule.met ? (
              <Check
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: '#16a34a' }}
                aria-hidden="true"
              />
            ) : (
              <X className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />
            )}
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
