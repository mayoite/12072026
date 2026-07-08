import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import enMessages from '@/i18n/messages/en.json';
import { HOMEPAGE_COLLECTIONS_CONTENT } from '@/lib/site-data/homepage';

vi.mock('next-intl/server', async () => {
  const messages = (await import('@/i18n/messages/en.json')).default;
  return {
    getTranslations: async (namespace: string) => {
      const ns = messages[namespace as keyof typeof messages] as Record<string, unknown>;
      const t = (key: string) => {
        const val = ns[key];
        return typeof val === 'string' ? val : key;
      };
      t.raw = (key: string) => ns[key] ?? [];
      t.rich = t;
      return t;
    },
  };
});

vi.mock('next/cache', () => ({
  unstable_cache: (fn: () => unknown) => fn
}));

vi.mock('@phosphor-icons/react', () => ({
  ArrowRight: () => <span data-testid="arrow-right" />,
  CheckCircle2: () => <span data-testid="check" />,
  Clock3: () => <span data-testid="clock" />,
  ShieldCheck: () => <span data-testid="shield" />
}));

vi.mock('@/features/catalog/getProducts', () => ({
  getCatalog: vi.fn().mockResolvedValue([])
}));

vi.mock('@/features/catalog/categories', () => ({
  buildRequestedCategoryCatalog: vi.fn().mockReturnValue([
    {
      id: 'cat-seating',
      name: 'Seating',
      series: [
        {
          products: [
            {
              images: ['/seating.jpg']
            }
          ]
        }
      ]
    }
  ]),
  getCatalogCategoryHref: (id: string) => `/catalog/${id}`,
  getCatalogCategoryLabel: (_id: string, name: string) => `Label for ${name}`
}));

const products = enMessages.products;

describe('CategoryGrid Component', () => {
  it('renders async products catalog grid correctly', async () => {
    const jsx = await CategoryGrid();
    render(jsx);

    expect(screen.getByText(HOMEPAGE_COLLECTIONS_CONTENT.titleLead)).toBeInTheDocument();
    expect(screen.getByText(HOMEPAGE_COLLECTIONS_CONTENT.titleAccent)).toBeInTheDocument();
    expect(screen.getByText(products.pillarsTitleLead)).toBeInTheDocument();
    expect(screen.getByText(products.pillarsTitleAccent)).toBeInTheDocument();

    products.pillars.forEach((p) => {
      expect(screen.getByText(p.title)).toBeInTheDocument();
      expect(screen.getByText(p.detail)).toBeInTheDocument();
    });

    const categoryLink = screen.getByRole('link');
    expect(categoryLink).toHaveAttribute('href', '/catalog/cat-seating');

    const img = screen.getByAltText('Label for Seating');
    expect(img).toHaveAttribute('src', '/seating.jpg');
  });
});
