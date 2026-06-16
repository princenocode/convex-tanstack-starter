import { useMutation } from 'convex/react';
import { api } from '@my-sample/backend/api';

// Typed Convex mutations. Authorization + validation live server-side (§12.1);
// these are thin client bindings.
export const useCreateTask = () => useMutation(api.tasks.mutations.create);
export const useSetTaskCompleted = () => useMutation(api.tasks.mutations.setCompleted);
export const useRemoveTask = () => useMutation(api.tasks.mutations.remove);
