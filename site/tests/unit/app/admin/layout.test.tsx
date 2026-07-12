import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import AdminLayout from '@/app/admin/layout';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({ get: vi.fn() })),
  headers: vi.fn(() => new Headers()),
}));

vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter' }),
}));


vi.mock('@/features/planner/admin/AdminLayoutShell', async () => {
  const actual = await vi.importActual('@/features/planner/admin/AdminLayoutShell');
  return {
    ...actual,
    default: (props: any) => <div data-testid="mock---features-planner-admin-AdminLayoutShell">{JSON.stringify(props)}</div>,
  };
});

vi.mock('@/components/security/CsrfBootstrap', async () => {
  const actual = await vi.importActual('@/components/security/CsrfBootstrap');
  return {
    ...actual,
    default: (props: any) => <div data-testid="mock---components-security-CsrfBootstrap">{JSON.stringify(props)}</div>,
  };
});

vi.mock('@/lib/auth/session', () => ({
  requireAuthUser: vi.fn(),
}));

vi.mock('@/lib/fonts', async () => {
  const actual = await vi.importActual('@/lib/fonts');
  return {
    ...actual,
    default: (props: any) => <div data-testid="mock---lib-fonts">{JSON.stringify(props)}</div>,
  };
});


describe('app/admin/layout.tsx', () => {
  it('exports noindex robots metadata', async () => {
    const { metadata } = await import('@/app/admin/layout');
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it('renders without crashing', async () => {
    // For coverage, we just need to render it
    const resolved = await AdminLayout({ params: Promise.resolve({ id: '1', type: 'standard' }), searchParams: Promise.resolve({ page: '1' }) } as any);
    const html = renderToStaticMarkup(resolved);
    // minimal assertion
    expect(html).toContain('mock---features-planner-admin-AdminLayoutShell');
  });
});
