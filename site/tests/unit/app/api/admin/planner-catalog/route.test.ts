import { describe, it, expect, vi } from 'vitest';
import { GET, POST } from '@/app/api/admin/planner-catalog/route';
import { listConfiguratorCatalog, createConfiguratorCatalog } from '@/features/admin/api/catalogAdminHandlers';
import { NextRequest } from 'next/server';

vi.mock('@/features/shared/api/withAuth', () => ({
  withAuth: (handler: any) => handler,
}));

vi.mock('@/features/admin/api/catalogAdminHandlers', () => ({
  listConfiguratorCatalog: vi.fn(),
  createConfiguratorCatalog: vi.fn(),
}));

describe('admin/planner-catalog route', () => {
  it('GET calls listConfiguratorCatalog', async () => {
    const req = new NextRequest('http://localhost');
    await (GET as any)(req);
    expect(listConfiguratorCatalog).toHaveBeenCalledWith(req);
  });

  it('POST calls createConfiguratorCatalog', async () => {
    const req = new NextRequest('http://localhost');
    await (POST as any)(req);
    expect(createConfiguratorCatalog).toHaveBeenCalledWith(req);
  });
});
