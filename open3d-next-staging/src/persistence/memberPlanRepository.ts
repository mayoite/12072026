/**
 * Member Plan Repository — fetch-based cloud persistence for authenticated plan operations.
 *
 * Uses OOFPLWeb /api/plans/* REST endpoints.
 * Auth token is supplied via an async accessor so the caller controls token lifecycle.
 *
 * All methods return discriminated-union result objects; they never throw.
 * Error codes align with the 7 categories from plannerCloudApi.ts.
 */

import { isStagingPlannerDocument, type StagingPlannerDocument } from "./plannerDocumentTypes";

// ── Public types ──

/** Dependency-injectable fetch function */
export type FetchFn = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

/** Async token accessor — returns current auth token or null */
export type TokenFn = () => Promise<string | null>;

// ── Result types ──

export type LoadResult =
  | { status: "ok"; document: StagingPlannerDocument }
  | { status: "not-found" }
  | { status: "unauthenticated" }
  | { status: "forbidden" }
  | { status: "corrupt"; raw: unknown }
  | { status: "network"; message: string };

export type SaveResult =
  | { status: "ok"; document: StagingPlannerDocument }
  | { status: "unauthenticated" }
  | { status: "forbidden" }
  | { status: "conflict" }
  | { status: "network"; message: string };

/** Alias for callers that imported MemberSaveResult */
export type MemberSaveResult = SaveResult;

export interface ListSummary {
  id: string;
  name: string;
  updated_at: string | undefined;
}

export type ListResult =
  | { status: "ok"; summaries: ListSummary[] }
  | { status: "unauthenticated" }
  | { status: "network"; message: string };

export type DeleteResult =
  | { status: "ok" }
  | { status: "not-found" }
  | { status: "unauthenticated" }
  | { status: "forbidden" }
  | { status: "network"; message: string };

// ── Repository interface ──

export interface MemberPlanRepository {
  load(saveId: string): Promise<LoadResult>;
  save(document: StagingPlannerDocument, saveId?: string): Promise<SaveResult>;
  list(): Promise<ListResult>;
  delete(saveId: string): Promise<DeleteResult>;
}

// ── Factory ──

/**
 * Create a member plan repository.
 *
 * @param tokenFn - async function returning the current auth token or null
 * @param fetchFn - fetch implementation (defaults to global fetch)
 */
export function createMemberPlanRepository(
  tokenFn: TokenFn,
  fetchFn: FetchFn = fetch,
): MemberPlanRepository {
  return new MemberPlanRepositoryImpl(tokenFn, fetchFn);
}

// ── Helpers ──

function networkMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Network error";
}

async function buildHeaders(tokenFn: TokenFn): Promise<Record<string, string>> {
  const token = await tokenFn();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// ── Implementation ──

class MemberPlanRepositoryImpl implements MemberPlanRepository {
  constructor(
    private readonly tokenFn: TokenFn,
    private readonly fetchFn: FetchFn,
  ) {}

  async load(saveId: string): Promise<LoadResult> {
    try {
      const headers = await buildHeaders(this.tokenFn);
      const response = await this.fetchFn(`/api/plans/${encodeURIComponent(saveId)}`, {
        method: "GET",
        headers,
      });

      if (response.status === 401) return { status: "unauthenticated" };
      if (response.status === 403) return { status: "forbidden" };
      if (response.status === 404) return { status: "not-found" };
      if (!response.ok) return { status: "network", message: `HTTP ${response.status}` };

      const body = await response.json() as Record<string, unknown>;
      const document = body.document;
      if (!isStagingPlannerDocument(document)) return { status: "corrupt", raw: document };
      return { status: "ok", document };
    } catch (error) {
      return { status: "network", message: networkMessage(error) };
    }
  }

  async save(document: StagingPlannerDocument, _saveId?: string): Promise<SaveResult> {
    try {
      const headers = await buildHeaders(this.tokenFn);
      const response = await this.fetchFn(`/api/plans/${encodeURIComponent(document.id)}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ document }),
      });

      if (response.status === 401) return { status: "unauthenticated" };
      if (response.status === 403) return { status: "forbidden" };
      if (response.status === 409) return { status: "conflict" };
      if (!response.ok) return { status: "network", message: `HTTP ${response.status}` };

      const body = await response.json() as Record<string, unknown>;
      const saved = body.document;
      if (!isStagingPlannerDocument(saved)) {
        return { status: "network", message: "Missing document in response" };
      }
      return { status: "ok", document: saved };
    } catch (error) {
      return { status: "network", message: networkMessage(error) };
    }
  }

  async list(): Promise<ListResult> {
    try {
      const headers = await buildHeaders(this.tokenFn);
      const response = await this.fetchFn("/api/plans", { method: "GET", headers });

      if (response.status === 401) return { status: "unauthenticated" };
      if (!response.ok) return { status: "network", message: `HTTP ${response.status}` };

      const body = await response.json() as Record<string, unknown>;
      const documents = Array.isArray(body.documents)
        ? (body.documents as Record<string, unknown>[])
        : [];

      const summaries: ListSummary[] = documents.map((doc) => ({
        id: typeof doc.id === "string" ? doc.id : "",
        name: typeof doc.name === "string" ? doc.name : "Untitled",
        updated_at: typeof doc.updated_at === "string" ? doc.updated_at : undefined,
      }));

      return { status: "ok", summaries };
    } catch (error) {
      return { status: "network", message: networkMessage(error) };
    }
  }

  async delete(saveId: string): Promise<DeleteResult> {
    try {
      const headers = await buildHeaders(this.tokenFn);
      const response = await this.fetchFn(`/api/plans/${encodeURIComponent(saveId)}`, {
        method: "DELETE",
        headers,
      });

      if (response.status === 401) return { status: "unauthenticated" };
      if (response.status === 403) return { status: "forbidden" };
      if (response.status === 404) return { status: "not-found" };
      if (!response.ok) return { status: "network", message: `HTTP ${response.status}` };
      return { status: "ok" };
    } catch (error) {
      return { status: "network", message: networkMessage(error) };
    }
  }
}
