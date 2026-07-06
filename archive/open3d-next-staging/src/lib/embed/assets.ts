export function assetUrl(path: string): string {
  const normalizedPath = path.replace(/^\/+/, '');
  const baseHref = typeof document !== 'undefined' ? document.baseURI : 'http://localhost/';
  return new URL(normalizedPath, baseHref).toString();
}

export function modelAssetUrl(file: string): string {
  return assetUrl(`models/${file}.glb`);
}

export function textureAssetUrl(file: string): string {
  return assetUrl(`textures/${file}`);
}
