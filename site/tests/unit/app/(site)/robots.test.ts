import { describe, it, expect } from 'vitest';
import robots from '@/app/(site)/robots';

describe('robots.ts', () => {
  it('returns valid robots config', () => {
    const config = robots();
    expect(config.rules[0].userAgent).toBe('*');
    expect(config.sitemap[0]).toContain('/sitemap.xml');
  });
});