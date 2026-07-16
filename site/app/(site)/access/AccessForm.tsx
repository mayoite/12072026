"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { hasPublicSupabaseEnv } from "@/platform/supabase/env";
import { getCustomerSafeAuthError } from "@/lib/auth/customerSafeAuthError";
import { PLANNER_GUEST_COOKIE } from "@/lib/auth/constants";
import { loginWithSupabase } from "@/lib/auth/supabaseServerActions";

interface AccessFormProps {
  nextPath: string;
  guestHref: string;
  requiresAdmin?: boolean;
}

export function AccessForm({ nextPath, guestHref, requiresAdmin = false }: AccessFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!hasPublicSupabaseEnv()) {
      setIsSubmitting(false);
      setError(getCustomerSafeAuthError(new Error("missing_supabase_env")));
      return;
    }

    try {
      const result = await loginWithSupabase(email, password);
      
      if (!result.success) {
        setIsSubmitting(false);
        setError(result.error || "Login failed");
        return;
      }

      // Clear guest cookie on successful login
      document.cookie = `${PLANNER_GUEST_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      window.location.assign(nextPath);
    } catch (e: unknown) {
      setIsSubmitting(false);
      setError(getCustomerSafeAuthError(e));
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="typ-page-title">
          Welcome to Oando
        </h1>
        <p className="mt-3 text-sm text-[var(--text-muted)]">
          {requiresAdmin
            ? "Sign in with a platform admin account to open the admin console."
            : "Sign in to access your workspace, or continue as a guest to explore."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        method="post"
        autoComplete="on"
        noValidate={false}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@company.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="p-3 text-sm text-danger bg-danger-soft border border-accent rounded-md"
          >
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-[var(--border-strong)]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-[var(--text-muted)]">
            Don&apos;t have an account or just looking around?
          </p>
          <Link
            href={guestHref}
            className="inline-flex h-10 items-center justify-center rounded-md border border-[var(--border-strong)] bg-white px-8 text-sm font-medium transition-colors hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-[var(--text-strong)] w-full shadow-sm"
          >
            Continue as Guest
          </Link>
        </div>
      </div>
    </div>
  );
}
