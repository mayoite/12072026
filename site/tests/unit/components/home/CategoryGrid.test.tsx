import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import enMessages from '@/i18n/messages/en.json';
import { HOMEPAGE_COLLECTIONS_CONTENT } from '@/features/site/data/homepage';
import { CATEGORY_ROUTE_COPY } from '@/features/site/data/routeCopy';
import { buildRequestedCategoryCatalog } from '@/lib/catalog/site/categories';

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

vi.mock('@phosphor-icons/react/dist/ssr', () => ({
  ArrowRight: () => <span data-testid="arrow-right" />,
  CheckCircle: () => <span data-testid="check" />,
  Clock: () => <span data-testid="clock" />,
  ShieldCheck: () => <span data-testid="shield" />,
}));

vi.mock('@/lib/catalog/site/getProducts', () => ({
  getCatalog: vi.fn().mockResolvedValue([])
}));

vi.mock('@/lib/catalog/site/categories', () => ({
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
  beforeEach(() => {
    vi.mocked(buildRequestedCategoryCatalog).mockReturnValue([
      {
        id: 'cat-seating',
        name: 'Seating',
        series: [
          {
            products: [
              {
                images: ['/seating.jpg'],
              },
            ],
          },
        ],
      },
    ] as never);
  });

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

  it('shows honest empty state when no categories are published', async () => {
    vi.mocked(buildRequestedCategoryCatalog).mockReturnValue([]);

    const jsx = await CategoryGrid();
    render(jsx);

    expect(
      screen.getByRole('heading', { name: CATEGORY_ROUTE_COPY.offlineTitle }),
    ).toBeInTheDocument();
    expect(screen.getByText(CATEGORY_ROUTE_COPY.offlineDescription)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
