export async function rollbackSvgAssetV2<T>(input: {
  readonly assetId: string;
  readonly targetVersion: number;
  readonly actorId: string;
  readonly repoint: (input: {
    readonly assetId: string;
    readonly targetVersion: number;
    readonly actorId: string;
  }) => Promise<T>;
}): Promise<T> {
  if (!Number.isInteger(input.targetVersion) || input.targetVersion < 1) {
    throw new Error("Rollback target must be an immutable positive version");
  }
  return input.repoint({
    assetId: input.assetId,
    targetVersion: input.targetVersion,
    actorId: input.actorId,
  });
}
