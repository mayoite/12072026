import workflowsJson from '../../../tech-stack-generated/data/workflows.json'
import type { RouteDomainRecord } from './routeDomainTypes'

export const workflowRecords = workflowsJson as RouteDomainRecord[]
