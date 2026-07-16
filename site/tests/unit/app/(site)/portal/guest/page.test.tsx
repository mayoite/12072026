import { describe, it, expect, vi } from 'vitest';
import { redirect } from 'next/navigation';
import GuestPortalPage from '@/app/(site)/portal/guest/page';
import { buildAccessRedirect } from '@/lib/auth/plannerRedirect';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@/lib/auth/plannerRedirect', () => ({
  buildAccessRedirect: vi.fn(() => '/access?next=%2Fportal'),
}));

describe('app/(site)/portal/guest/page.tsx', () => {
  it('redirects guests using the canonical access redirect helper', () => {
    GuestPortalPage();
    expect(buildAccessRedirect).toHaveBeenCalledWith('/portal');
    expect(redirect).toHaveBeenCalledWith('/access?next=%2Fportal');
  });
});
