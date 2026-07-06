export type EmbedHostMode = 'guest' | 'member';

export interface EmbedHostConfig {
  mode: EmbedHostMode;
  projectId: string | null;
  projectListHref: string | null;
  portalHref: string | null;
  dashboardHref: string | null;
  helpHref: string | null;
  adminCatalogHref: string | null;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

let currentConfig: EmbedHostConfig = {
  mode: 'guest',
  projectId: null,
  projectListHref: null,
  portalHref: null,
  dashboardHref: null,
  helpHref: null,
  adminCatalogHref: null,
};

function readHrefParam(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function isUuid(value: string | null | undefined): boolean {
  return Boolean(value && UUID_RE.test(value.trim()));
}

export function parseEmbedHostConfig(url = window.location.href): EmbedHostConfig {
  const searchParams = new URL(url).searchParams;
  const mode = searchParams.get('mode') === 'member' ? 'member' : 'guest';
  const projectId = readHrefParam(searchParams.get('id'));

  return {
    mode,
    projectId,
    projectListHref: readHrefParam(searchParams.get('projectListHref')),
    portalHref: readHrefParam(searchParams.get('portalHref')),
    dashboardHref: readHrefParam(searchParams.get('dashboardHref')),
    helpHref: readHrefParam(searchParams.get('helpHref')),
    adminCatalogHref: readHrefParam(searchParams.get('adminCatalogHref')),
  };
}

export function setEmbedHostConfig(config: EmbedHostConfig): void {
  currentConfig = config;
}

export function getEmbedHostConfig(): EmbedHostConfig {
  return currentConfig;
}

export function shouldUseHostedPlans(): boolean {
  return currentConfig.mode === 'member';
}

export function createEmbedProjectId(): string {
  if (shouldUseHostedPlans() && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

export function resolveEmbedProjectId(preferredId?: string | null): string {
  if (shouldUseHostedPlans()) {
    return isUuid(preferredId) ? preferredId!.trim() : createEmbedProjectId();
  }
  const trimmed = preferredId?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : createEmbedProjectId();
}
