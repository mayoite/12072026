export type RouteChromeHeaderMode = "full" | "hidden";
export type RouteChromeFooterMode = "full" | "login-tools" | "hidden";

export interface RouteChromeMode {
  header: RouteChromeHeaderMode;
  footer: RouteChromeFooterMode;
}

function splitPathAndSearch(input: string | null): { pathname: string | null; search: string } {
  if (!input) return { pathname: null, search: "" };
  const queryIndex = input.indexOf("?");
  if (queryIndex === -1) return { pathname: input, search: "" };
  return { pathname: input.slice(0, queryIndex), search: input.slice(queryIndex + 1) };
}

function matchesPath(pathname: string | null, exact: string): boolean {
  return pathname === exact;
}

function matchesPrefix(pathname: string | null, prefix: string): boolean {
  if (!pathname) return false;
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function matchesAnyPrefix(pathname: string | null, prefixes: string[]): boolean {
  return prefixes.some((prefix) => matchesPrefix(pathname, prefix));
}

const LOGIN_PREFIXES = [
  "/login",
  "/oando-planner/login",
  "/buddy-planner/login",
];

const CAD_PREFIXES = [
  "/planner/canvas",
  "/planner/guest",
  "/planner/open3d",
  "/oando-planner/canvas",
  "/planners",
  "/buddy-planner/editor",
];

const BUDDY_EDITOR_PREFIX = "/buddy-planner/t/";

const WORKSPACE_PREFIXES = [
  "/access",
  "/choose-product",
  "/dashboard",
  "/portal",
  "/admin",
];

function isPlannerMarketingRoute(pathname: string | null): boolean {
  return matchesPath(pathname, "/oando-planner") || matchesPath(pathname, "/buddy-planner");
}

function isBuddyMarketingRoute(pathname: string | null): boolean {
  return matchesPath(pathname, "/buddy-planner");
}

function isCadRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  if (matchesAnyPrefix(pathname, CAD_PREFIXES)) return true;
  return pathname.startsWith(BUDDY_EDITOR_PREFIX);
}

function isLoginPath(pathname: string | null): boolean {
  return matchesAnyPrefix(pathname, LOGIN_PREFIXES);
}

function loginHasNextParam(search: string): boolean {
  if (!search) return false;
  return new URLSearchParams(search).has("next");
}

function isWorkspaceRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  if (matchesAnyPrefix(pathname, WORKSPACE_PREFIXES)) return true;

  const plannerMarketing = isPlannerMarketingRoute(pathname);
  const buddyMarketing = isBuddyMarketingRoute(pathname);

  if (!plannerMarketing && matchesPrefix(pathname, "/oando-planner")) return true;
  if (!buddyMarketing && matchesPrefix(pathname, "/buddy-planner")) return true;

  return false;
}

export function resolveRouteChromeMode(pathInput: string | null): RouteChromeMode {
  const { pathname, search } = splitPathAndSearch(pathInput);

  if (isLoginPath(pathname)) {
    if (loginHasNextParam(search)) {
      return { header: "full", footer: "login-tools" };
    }
    return { header: "hidden", footer: "login-tools" };
  }

  if (isCadRoute(pathname) || isWorkspaceRoute(pathname)) {
    return { header: "hidden", footer: "hidden" };
  }

  return { header: "full", footer: "full" };
}
