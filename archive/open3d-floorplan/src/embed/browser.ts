import '../app.css';

import { mount } from 'svelte';

import { fetchPlannerFurnitureCatalog } from '$lib/embed/plannerCatalog';
import { parseEmbedHostConfig, setEmbedHostConfig } from '$lib/embed/hostConfig';
import { mergeFurnitureCatalog } from '$lib/utils/furnitureCatalog';

const target = document.getElementById('app');

if (!target) {
  throw new Error('Missing planner mount target.');
}

async function boot(): Promise<void> {
  const hostConfig = parseEmbedHostConfig(window.location.href);
  setEmbedHostConfig(hostConfig);

  try {
    const remoteCatalog = await fetchPlannerFurnitureCatalog();
    if (remoteCatalog.length > 0) {
      mergeFurnitureCatalog(remoteCatalog);
    }
  } catch (error) {
    console.warn('[Embed] Planner catalog preload failed:', error);
  }

  const { default: Open3dPlannerEditor } = await import('$lib/components/embedded/Open3dPlannerEditor.svelte');

  mount(Open3dPlannerEditor, {
    target,
    props: {
      projectId: hostConfig.projectId,
      editorPath: window.location.pathname,
      projectListHref: hostConfig.projectListHref,
      portalHref: hostConfig.portalHref,
      dashboardHref: hostConfig.dashboardHref,
      helpHref: hostConfig.helpHref,
      adminCatalogHref: hostConfig.adminCatalogHref,
      syncUrl: true,
    },
  });
}

void boot();
