import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind class names with correct precedence. The single source of
// truth for class composition across the app and shared primitives.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
