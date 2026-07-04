import { describe, it, expect } from 'vitest';
import { DashboardClient } from '@/app/(site)/dashboard/DashboardClient';

describe('DashboardClient.tsx', () => {
  it('exports DashboardClient', () => {
    expect(DashboardClient).toBeDefined();
  });
});