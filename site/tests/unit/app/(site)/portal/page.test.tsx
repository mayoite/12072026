import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PortalPage from '@/app/(site)/portal/page';
import { requireAuthUser } from '@/lib/auth/session';
import { isPlannerDatabaseConfigured } from '@/features/planner/store/plannerPersistence';
import { listPlannerDocumentsFromStore } from '@/features/planner/store/plannerSaves';

vi.mock('@/lib/auth/session', () => ({
  requireAuthUser: vi.fn(),
}));

vi.mock('@/features/planner/store/plannerPersistence', () => ({
  isPlannerDatabaseConfigured: vi.fn(),
}));

vi.mock('@/features/planner/store/plannerSaves', () => ({
  listPlannerDocumentsFromStore: vi.fn(),
}));

vi.mock('@/features/planner/portal/PortalPageView', () => ({
  default: ({
    databaseConfigured,
    plans,
    userName,
  }: {
    databaseConfigured: boolean;
    plans: unknown[];
    userName: string | null;
  }) => (
    <div
      data-testid="portal-page-view"
      data-db={String(databaseConfigured)}
      data-plan-count={String(plans.length)}
      data-user={userName ?? ''}
    />
  ),
}));

describe('app/(site)/portal/page.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuthUser).mockResolvedValue({ id: 'user-1', name: 'Test User' } as never);
    vi.mocked(isPlannerDatabaseConfigured).mockReturnValue(false);
    vi.mocked(listPlannerDocumentsFromStore).mockResolvedValue([]);
  });

  it('renders portal view for authenticated users', async () => {
    const page = await PortalPage();
    render(page);

    expect(screen.getByTestId('portal-page-view')).toHaveAttribute('data-user', 'Test User');
    expect(screen.getByTestId('portal-page-view')).toHaveAttribute('data-db', 'false');
  });
});
