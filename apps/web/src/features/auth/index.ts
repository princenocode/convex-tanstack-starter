// Public API of the auth feature (§7). The only import surface for the rest of
// the app — internals (auth-client wiring, schema) stay private.
export { useAuth } from './hooks/useAuth';
export { AuthBoundary } from './components/AuthBoundary';
export { SignInForm } from './components/SignInForm';
