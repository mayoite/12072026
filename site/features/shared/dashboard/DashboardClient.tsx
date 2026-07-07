"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PLANNER_GUEST_COOKIE } from "@/lib/auth/constants";
import { createClient } from "@/lib/supabase/client";
import { GlobalNavHeader } from "@/features/shared/shell/GlobalNavHeader";
import { WORKSPACE_HUB_SECTIONS, type WorkspaceHubItem } from "./workspaceHub";

interface DashboardClientProps {
  userEmail: string;
  accessError?: string;
}

function readPlannerDraftCount(): number {
  if (typeof window === "undefined") return 0;

  try {
    const raw = window.localStorage.getItem("planner_project_index");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

function HubCard({ item }: { item: WorkspaceHubItem }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="workspace-hub-card workspace-hub-card--link group flex h-full flex-col rounded-[1.35rem] border p-5 transition-[border-color,box-shadow,transform] duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="workspace-hub-card__icon inline-flex h-10 w-10 items-center justify-center rounded-xl"
          aria-hidden
        >
          <Icon size={18} />
        </span>
        <ArrowRight
          size={16}
          className="workspace-hub-card__arrow shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
      </div>
      <h3 className="workspace-hub-card__title mt-4 text-base font-semibold tracking-tight">{item.label}</h3>
      <p className="workspace-hub-card__desc mt-2 flex-1 text-sm leading-6">{item.description}</p>
      <span className="workspace-hub-card__cta mt-4 text-xs font-bold uppercase tracking-[0.1em]">Open</span>
    </Link>
  );
}

function accessErrorMessage(code: string | undefined): string | null {
  if (code === "unauthorized_admin_access") {
    return "Your account is signed in, but it does not have platform admin access. Ask an owner to grant the admin role in Supabase app_metadata.role = \"admin\", then sign in again.";
  }
  return null;
}

export function DashboardClient({ userEmail, accessError }: DashboardClientProps) {
  const router = useRouter();
  const [plannerDraftCount] = useState(() => readPlannerDraftCount());
  const [isSigningOut, setIsSigningOut] = useState(false);

  const plannerSummary = useMemo(
    () =>
      plannerDraftCount > 0
        ? `${plannerDraftCount} saved local planner session${plannerDraftCount === 1 ? "" : "s"} ready to resume.`
        : "No saved local planner sessions yet — open the canvas to start a layout.",
    [plannerDraftCount],
  );

  const destinationCount = useMemo(
    () => WORKSPACE_HUB_SECTIONS.reduce((total, section) => total + section.items.length, 0),
    [],
  );

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    document.cookie = `${PLANNER_GUEST_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    router.replace("/access");
    router.refresh();
  }

  return (
    <section className="workspace-hub min-h-screen">
      <GlobalNavHeader />

      <div className="workspace-hub__frame mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8">
        {accessErrorMessage(accessError) ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm leading-6 text-strong" role="alert">
            {accessErrorMessage(accessError)}
          </div>
        ) : null}
        <header className="workspace-hub__hero rounded-[2rem] border p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="workspace-hub__eyebrow text-[0.6875rem] font-semibold uppercase tracking-[0.3em]">
                Member workspace
              </p>
              <p className="workspace-hub__eyebrow mt-2 text-xs font-medium">
                {plannerDraftCount > 0 ? "Recent work available" : "Ready for first draft"}
              </p>
              <h1 className="workspace-hub__title mt-4 text-4xl font-semibold tracking-tight">
                Your planner workspace
              </h1>
              <p className="workspace-hub__lead mt-4 text-sm leading-7 sm:text-base">
                Signed in as {userEmail}. {plannerSummary}
              </p>
              <p className="workspace-hub__meta mt-3 text-xs">{destinationCount} destinations available</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/planner" className="workspace-hub__primary-btn rounded-full px-5 py-3 text-sm font-semibold">
                Open planner
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="workspace-hub__ghost-btn rounded-full border px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSigningOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </header>

        {WORKSPACE_HUB_SECTIONS.map((section) => (
          <section key={section.title} className="workspace-hub__section" aria-labelledby={`hub-${section.title}`}>
            <header className="workspace-hub__section-header mb-4">
              <h2 id={`hub-${section.title}`} className="workspace-hub__section-title text-lg font-semibold tracking-tight">
                {section.title}
              </h2>
              <p className="workspace-hub__section-copy mt-1 text-sm">{section.summary}</p>
            </header>
            <div className="workspace-hub__grid grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {section.items.map((item) => (
                <HubCard key={item.href} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
