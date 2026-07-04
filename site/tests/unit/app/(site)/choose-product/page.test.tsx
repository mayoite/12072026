import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import ChooseProductRoute from '@/app/(site)/choose-product/page';
import { getOptionalUser } from '@/lib/auth/session';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@/lib/auth/session', () => ({
  getOptionalUser: vi.fn(),
}));

vi.mock('@/features/shared/entry/ChooseProductPage', () => ({
  ChooseProductPage: ({ guestMode }: { guestMode: boolean }) => (
    <div data-testid="choose-product-page" data-guest={String(guestMode)} />
  ),
}));

describe('app/(site)/choose-product/page.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders guest chooser when guest mode is enabled', async () => {
    vi.mocked(getOptionalUser).mockResolvedValue(null);

    const page = await ChooseProductRoute({ searchParams: Promise.resolve({ mode: 'guest' }) });
    render(page);

    expect(screen.getByTestId('choose-product-page')).toHaveAttribute('data-guest', 'true');
    expect(redirect).not.toHaveBeenCalled();
  });

  it('redirects unauthenticated users without guest mode to access', async () => {
    vi.mocked(getOptionalUser).mockResolvedValue(null);

    await ChooseProductRoute({});

    expect(redirect).toHaveBeenCalledWith('/access?next=%2Fdashboard');
  });

  it('redirects authenticated users to the dashboard', async () => {
    vi.mocked(getOptionalUser).mockResolvedValue({ id: 'user-1' } as never);

    await ChooseProductRoute({});

    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });
});
