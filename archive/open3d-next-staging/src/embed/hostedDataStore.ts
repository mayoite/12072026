import type { Project } from '$lib/models/types';
import { localStore } from '$lib/services/localDataStore';

import { browserApiFetch } from './browserApi';
import {
  plannerDocumentToProject,
  projectToPlannerDocument,
  rememberPlannerDocumentMetadata,
} from './plannerProjectBridge';
import { createEmbedProjectId, isUuid, resolveEmbedProjectId } from './hostConfig';
import type { HostedPlannerDocument, HostedPlannerSummary } from './plannerTypes';

type PlansListResponse = {
  documents?: HostedPlannerSummary[];
};

type PlanDocumentResponse = {
  document?: HostedPlannerDocument;
};

function parseJson<T>(response: Response): Promise<T> {
  return response.json().catch(() => ({})) as Promise<T>;
}

export const hostedStore = {
  async save(project: Project) {
    const resolvedId = resolveEmbedProjectId(project.id);
    if (project.id !== resolvedId) {
      project.id = resolvedId;
    }

    const document = projectToPlannerDocument(project);
    const response = await browserApiFetch(`/api/plans/${encodeURIComponent(resolvedId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document }),
    });

    if (!response.ok) {
      const body = await parseJson<{ error?: string }>(response);
      throw new Error(body.error || `Failed to save plan (${response.status})`);
    }

    const payload = await parseJson<PlanDocumentResponse>(response);
    if (payload.document) {
      rememberPlannerDocumentMetadata(payload.document);
      project.updatedAt = new Date(payload.document.updatedAt ?? Date.now());
    }
  },

  async load(id: string) {
    if (!isUuid(id)) {
      return null;
    }

    const response = await browserApiFetch(`/api/plans/${encodeURIComponent(id)}`, {
      method: 'GET',
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const body = await parseJson<{ error?: string }>(response);
      throw new Error(body.error || `Failed to load plan (${response.status})`);
    }

    const payload = await parseJson<PlanDocumentResponse>(response);
    if (!payload.document) {
      return null;
    }

    return plannerDocumentToProject(payload.document);
  },

  async list() {
    const response = await browserApiFetch('/api/plans', { method: 'GET' });
    if (response.status === 401) {
      return [];
    }
    if (!response.ok) {
      const body = await parseJson<{ error?: string }>(response);
      throw new Error(body.error || `Failed to list plans (${response.status})`);
    }

    const payload = await parseJson<PlansListResponse>(response);
    const documents = Array.isArray(payload.documents) ? payload.documents : [];
    return documents.map((document) => ({
      id: document.id,
      name: document.name,
      updatedAt: document.updated_at,
    }));
  },

  async delete(id: string) {
    if (!isUuid(id)) {
      await localStore.delete(id);
      return;
    }

    const response = await browserApiFetch(`/api/plans/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    if (response.status === 404) {
      return;
    }

    if (!response.ok) {
      const body = await parseJson<{ error?: string }>(response);
      throw new Error(body.error || `Failed to delete plan (${response.status})`);
    }
  },

  async duplicate(id: string) {
    const original = await this.load(id);
    if (!original) return null;
    const duplicateId = createEmbedProjectId();
    const duplicate: Project = {
      ...original,
      id: duplicateId,
      name: `${original.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.save(duplicate);
    return duplicate;
  },

  saveThumbnail(id: string, dataUrl: string) {
    localStore.saveThumbnail(id, dataUrl);
  },

  getThumbnail(id: string) {
    return localStore.getThumbnail(id);
  },
};
