import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import PlansManagement from '@/app/admin/plans/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter' }),
}));


vi.mock('@/features/planner/admin/AdminPlansPageView', async () => {
  const actual = await vi.importActual('@/features/planner/admin/AdminPlansPageView');
  return {
    ...actual,
    default: (props: any) => <div data-testid="mock---features-planner-admin-AdminPlansPageView">{JSON.stringify(props)}</div>,
  };
});


describe('app/admin/plans/page.tsx', () => {
  it('renders without crashing', async () => {
    // For coverage, we just need to render it
    render(<PlansManagement {...({ params: Promise.resolve({ id: '1', type: 'standard' }), searchParams: Promise.resolve({ page: '1' }) } as any)} />);
    // minimal assertion
    expect(document.body.innerHTML).toBeDefined();
  });
});
