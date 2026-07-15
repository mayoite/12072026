import { describe, it, expect } from 'vitest';
import robots from '@/app/(site)/robots';
import { ROBOTS_DISALLOW_PREFIXES } from '@/features/site/data/routeClassification';

describe('robots.ts', () => {
  it('returns valid robots config aligned with route classification', () => {
    const config = robots();
    expect(config.rules[0].userAgent).toBe('*');
    expect(config.sitemap[0]).toContain('/sitemap.xml');
    expect(config.rules[0].disallow).toEqual([...ROBOTS_DISALLOW_PREFIXES]);
    expect(config.rules[0].disallow).toContain('/portal/');
    expect(config.rules[0].disallow).toContain('/planner/guest/');
  });
});