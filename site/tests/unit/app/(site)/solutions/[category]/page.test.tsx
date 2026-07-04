import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SolutionsCategoryPage, {
  generateStaticParams,
  generateMetadata,
} from '@/app/(site)/solutions/[category]/page';
import { notFound } from 'next/navigation';

// Mock navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NOT_FOUND');
  }),
}));

// Mock components
vi.mock('@/components/home/Hero', () => ({
  Hero: ({ title, subtitle }: any) => (
    <div data-testid="mock-hero">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </div>
  ),
}));

vi.mock('@/components/shared/ContactTeaser', () => ({
  ContactTeaser: () => <div data-testid="mock-contact-teaser">Contact Teaser</div>,
}));

vi.mock('@/components/shared/SectionIntro', () => ({
  SectionIntro: ({ kicker, title, description }: any) => (
    <div data-testid="mock-section-intro">
      <span>{kicker}</span>
      <span>{title}</span>
      <p>{description}</p>
    </div>
  ),
}));

// Mock seo utils
vi.mock('@/lib/site-data/seo', () => ({
  buildPageMetadata: (_url: string, opts: any) => ({
    title: opts.title,
    description: opts.description,
  }),
}));

vi.mock('@/lib/siteUrl', () => ({
  SITE_URL: 'http://localhost:3000',
}));

describe('SolutionsCategoryPage Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateStaticParams', () => {
    it('returns the category list', () => {
      const params = generateStaticParams();
      expect(params).toContainEqual({ category: 'seating' });
      expect(params).toContainEqual({ category: 'workstations' });
      expect(params).toContainEqual({ category: 'tables' });
      expect(params).toContainEqual({ category: 'storages' });
      expect(params).toContainEqual({ category: 'soft-seating' });
      expect(params).toContainEqual({ category: 'education' });
    });
  });

  describe('generateMetadata', () => {
    it('returns metadata for a valid category', async () => {
      const meta = await generateMetadata({
        params: Promise.resolve({ category: 'seating' }),
      });
      expect(meta.title).toBe('Seating Solutions');
      expect(meta.description).toContain('Ergonomic seating solutions');
    });

    it('returns fallback metadata for an invalid category', async () => {
      const meta = await generateMetadata({
        params: Promise.resolve({ category: 'invalid-cat' }),
      });
      expect(meta.title).toBe('Solutions');
      expect(meta.description).toContain('Tailored furniture solutions');
    });
  });

  describe('SolutionsCategoryPage Component', () => {
    it('renders correctly for a valid category', async () => {
      const pageElement = await SolutionsCategoryPage({
        params: Promise.resolve({ category: 'seating' }),
      });

      render(pageElement);

      expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
      expect(screen.getByTestId('mock-section-intro')).toBeInTheDocument();
      expect(screen.getByTestId('mock-contact-teaser')).toBeInTheDocument();

      expect(
        screen.getByRole('heading', { level: 1, name: 'Seating Solutions' }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Ergonomic seating solutions for focused and collaborative work.'),
      ).toBeInTheDocument();

      // Verify CTA links
      expect(screen.getByRole('link', { name: 'Browse products' })).toHaveAttribute('href', '/products');
      expect(screen.getByRole('link', { name: 'All solutions' })).toHaveAttribute('href', '/solutions');
      expect(screen.getByRole('link', { name: 'Contact planning desk' })).toHaveAttribute('href', '/contact');
    });

    it('calls notFound() for an invalid category', async () => {
      await expect(
        SolutionsCategoryPage({
          params: Promise.resolve({ category: 'invalid-cat' }),
        }),
      ).rejects.toThrow('NOT_FOUND');

      expect(notFound).toHaveBeenCalled();
    });
  });
});
