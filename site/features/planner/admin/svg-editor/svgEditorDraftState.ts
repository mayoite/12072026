export interface EditorDraftState<T> {
  readonly baseline: T;
  readonly draft: T;
}

export function createEditorDraft<T>(published: T): EditorDraftState<T> {
  return { baseline: published, draft: published };
}

export function advancePublishedDraft<T>(
  state: EditorDraftState<T>,
  published: T,
): EditorDraftState<T> {
  return { ...state, baseline: published, draft: published };
}

export function resetEditorDraft<T>(
  state: EditorDraftState<T>,
): EditorDraftState<T> {
  return { ...state, draft: state.baseline };
}
