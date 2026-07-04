import { describe, it, expect, vi } from 'vitest';
import { redirect } from 'next/navigation';
import GuestPortalPage from '@/app/(site)/portal/guest/page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('app/(site)/portal/guest/page.tsx', () => {
  it('redirects guests to access with portal next path', () => {
    GuestPortalPage();
    expect(redirect).toHaveBeenCalledWith('/access?next=%2Fportal');
  });
});
