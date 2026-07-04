const DB_NAME = "OOFPL_PlannerDraftStore";
const STORE_NAME = "drafts";
const TTL_MS = 24 * 60 * 60 * 1000;

let transientSessionId = "";
if (typeof window !== "undefined") {
  transientSessionId = sessionStorage.getItem("oofpl_draft_session_id") || "";
  if (!transientSessionId) {
    transientSessionId = crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}`;
    sessionStorage.setItem("oofpl_draft_session_id", transientSessionId);
  }
}

function hasDraftDBSupport(): boolean {
  return typeof window !== "undefined" && typeof globalThis.indexedDB !== "undefined";
}

function getDraftDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveDraft(key: string, payload: unknown) {
  if (!hasDraftDBSupport()) return;
  const db = await getDraftDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.put({
    id: `${transientSessionId}_${key}`,
    sessionId: transientSessionId,
    timestamp: Date.now(),
    payload,
  });
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(undefined);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getDraft(key: string): Promise<unknown | null> {
  if (!hasDraftDBSupport()) return null;
  const db = await getDraftDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const request = store.get(`${transientSessionId}_${key}`);
  
  return new Promise((resolve, reject) => {
    request.onsuccess = async () => {
      const record = request.result;
      if (record) {
        if (Date.now() - record.timestamp > TTL_MS) {
          const delTx = db.transaction(STORE_NAME, "readwrite");
          delTx.objectStore(STORE_NAME).delete(`${transientSessionId}_${key}`);
          resolve(null);
        } else {
          resolve(record.payload);
        }
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function clearExpiredDrafts() {
  if (!hasDraftDBSupport()) return;
  const db = await getDraftDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const request = store.getAll();
  
  request.onsuccess = () => {
    const all = request.result;
    const now = Date.now();
    for (const record of all) {
      if (now - record.timestamp > TTL_MS || record.sessionId !== transientSessionId) {
        store.delete(record.id);
      }
    }
  };
}

if (hasDraftDBSupport()) {
  clearExpiredDrafts().catch(console.error);
}
