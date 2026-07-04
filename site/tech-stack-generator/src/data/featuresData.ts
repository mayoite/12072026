import featuresJson from '../../../tech-stack-generated/data/features.json'

export type FeatureRecord = {
  slug: string
  title: string
  tagline: string
  summary: string
  sourcePath: string
  sourcePointer: string
  tryPath?: string
  memberPath?: string
}

export const featureRecords = (featuresJson as FeatureRecord[]).sort((left, right) =>
  left.slug.localeCompare(right.slug),
)
