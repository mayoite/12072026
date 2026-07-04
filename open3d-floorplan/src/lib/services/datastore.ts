import { shouldUseHostedPlans } from '$lib/embed/hostConfig';
import { hostedStore } from '$lib/embed/hostedDataStore';

import { localStore as browserLocalStore, type DataStore } from './localDataStore';

export type { DataStore } from './localDataStore';
export { localStore as fallbackLocalStore } from './localDataStore';

function activeStore(): DataStore {
  return shouldUseHostedPlans() ? hostedStore : browserLocalStore;
}

export const localStore: DataStore = {
  save(project) {
    return activeStore().save(project);
  },
  load(id) {
    return activeStore().load(id);
  },
  list() {
    return activeStore().list();
  },
  delete(id) {
    return activeStore().delete(id);
  },
  duplicate(id) {
    return activeStore().duplicate(id);
  },
  saveThumbnail(id, dataUrl) {
    return activeStore().saveThumbnail(id, dataUrl);
  },
  getThumbnail(id) {
    return activeStore().getThumbnail(id);
  },
};
