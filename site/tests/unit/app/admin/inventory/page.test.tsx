import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

vi.mock('node:path', () => ({
  default: {
    join: (...parts: string[]) => parts.join('/'),
  },
  join: (...parts: string[]) => parts.join('/'),
}));

vi.mock('node:fs', () => ({
  default: {
    existsSync: vi.fn(() => false),
    readFileSync: vi.fn(() => ''),
    statSync: vi.fn(() => ({ mtime: new Date('2026-06-28T00:00:00.000Z') })),
  },
  existsSync: vi.fn(() => false),
  readFileSync: vi.fn(() => ''),
  statSync: vi.fn(() => ({ mtime: new Date('2026-06-28T00:00:00.000Z') })),
}));

vi.mock('@/features/planner/admin/AdminInventoryPageView', () => ({
  default: ({ rowCount }: { rowCount: number }) => (
    <div data-testid="admin-inventory-view">rows:{rowCount}</div>
  ),
}));

import AdminInventoryPage from '@/app/admin/inventory/page';

describe('app/admin/inventory/page.tsx', () => {
  it('renders without crashing when inventory file is missing', () => {
    render(<AdminInventoryPage />);
    expect(document.querySelector('[data-testid="admin-inventory-view"]')).toBeTruthy();
  });
});
