export function buildEditorHref(projectId: string, editorPath = '/editor') {
  const searchParams = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();
  searchParams.set('id', projectId);
  return `${editorPath}?${searchParams.toString()}`;
}
