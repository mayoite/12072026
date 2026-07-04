import { describe, it, expect, vi } from 'vitest';
import '@/tests/helpers/nextIntlServerEnMock';
import { render, screen } from '@testing-library/react';
import React from 'react';
import TermsPage from '@/app/(site)/terms/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter' }),
}));


vi.mock('@/components/home/Hero', async () => {
  const actual = await vi.importActual('@/components/home/Hero');
  return {
    ...actual,
    default: (props: any) => <div data-testid="mock---components-home-Hero">{JSON.stringify(props)}</div>,
  };
});

vi.mock('@/components/shared/ContactTeaser', async () => {
  const actual = await vi.importActual('@/components/shared/ContactTeaser');
  return {
    ...actual,
    default: (props: any) => <div data-testid="mock---components-shared-ContactTeaser">{JSON.stringify(props)}</div>,
  };
});


describe('app/(site)/terms/page.tsx', () => {
  it('renders without crashing', async () => {
    render(await TermsPage());
    expect(
      screen.getByRole('heading', { level: 1, name: 'Terms & Conditions' }),
    ).toBeInTheDocument();
  });
});
