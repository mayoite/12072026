import { describe, it, expect, vi } from 'vitest';
import GuestPortalPlanViewerPage from '@/app/(site)/portal/guest/view/[id]/page';
import { redirect } from 'next/navigation';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('GuestPortalPlanViewerPage', () => {
  it('redirects to the access page with the correct next parameter', async () => {
    const params = Promise.resolve({ id: 'test-id' });
    await GuestPortalPlanViewerPage({ params });

    expect(redirect).toHaveBeenCalledWith('/access?next=%2Fportal%2Ftest-id');
  });
});
