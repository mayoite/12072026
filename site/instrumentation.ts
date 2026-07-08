/**
 * Next.js instrumentation hook.
 * Sentry was removed (wizard install + hardcoded DSN). Re-add monitoring only with
 * env-based DSN and explicit product approval.
 */
export async function register(): Promise<void> {
  // no-op — reserved for future optional observability
}
