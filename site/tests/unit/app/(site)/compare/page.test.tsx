import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComparePage from '@/app/(site)/compare/page';
import { COMPARE_ROUTE_COPY } from '@/lib/site-data/routeCopy';
import { getProducts } from '@/features/catalog/getProducts';

vi.mock('@/features/catalog/getProducts', () => ({
  getProducts: vi.fn(async () => []),
}));

vi.mock('@/components/shared/SectionIntro', () => ({
  SectionIntro: ({ title }: { title: string }) => <h2>{title}</h2>,
}));

vi.mock('@/components/products/CompareColumnActions', () => ({
  CompareColumnActions: () => <div data-testid="compare-column-actions" />,
}));

vi.mock('@/components/ui/TrackedLink', () => ({
  TrackedLink: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('app/(site)/compare/page.tsx', () => {
  it('renders empty compare state when no items are provided', async () => {
    const page = await ComparePage({});
    render(page);

    expect(screen.getByRole('heading', { level: 1, name: /Compare selected workspace options/i })).toBeInTheDocument();
    expect(screen.getByText(COMPARE_ROUTE_COPY.emptyTitle)).toBeInTheDocument();
    expect(screen.queryByText('Specification review')).not.toBeInTheDocument();
    expect(screen.getByTestId("home-marketing-layout")).toBeInTheDocument();
    expect(getProducts).not.toHaveBeenCalled();
  });

  it('resolves selected products from one catalog read', async () => {
    vi.mocked(getProducts).mockResolvedValueOnce([
      {
        id: 'chair-a',
        name: 'Chair A',
        slug: 'chair-a',
        category_id: 'chairs',
        images: [],
        specs: { dimensions: '600 x 600', features: ['Adjustable'] },
        metadata: {},
        series_id: 'task',
        series_name: 'Task',
        created_at: '2026-01-01',
      },
      {
        id: 'chair-b',
        name: 'Chair B',
        slug: 'chair-b',
        category_id: 'chairs',
        images: [],
        specs: {},
        metadata: {},
        series_id: 'task',
        series_name: 'Task',
        created_at: '2026-01-01',
      },
    ]);

    const page = await ComparePage({
      searchParams: Promise.resolve({ items: 'chair-a,missing,chair-b' }),
    });
    render(page);

    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Chair A')).toBeInTheDocument();
    expect(screen.getByText('Chair B')).toBeInTheDocument();
    expect(screen.queryByText(COMPARE_ROUTE_COPY.emptyTitle)).not.toBeInTheDocument();
  });
});
