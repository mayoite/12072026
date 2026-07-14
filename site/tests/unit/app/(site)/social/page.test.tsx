import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SocialPage, { metadata } from '@/app/(site)/social/page';

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

vi.mock('@/components/shared/RouteCtaBand', () => ({
  RouteCtaBand: ({ title, description, actions }: any) => (
    <div data-testid="mock-cta-band">
      <h3>{title}</h3>
      <p>{description}</p>
      {actions.map((act: any) => (
        <a key={act.label} href={act.href}>{act.label}</a>
      ))}
    </div>
  ),
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

// Mock metadata & copies
vi.mock('@/features/site/data/routeMetadata', () => ({
  SOCIAL_PAGE_METADATA: { title: 'Social Title' },
}));

vi.mock('@/features/site/data/routeCopy', () => ({
  SOCIAL_PAGE_COPY: {
    heroTitle: 'Hero Title',
    heroSubtitle: 'Hero Subtitle',
    introKicker: 'Intro Kicker',
    introTitle: 'Intro Title',
    introDescription: 'Intro Description',
    handleLabel: '@oando.official',
    feedKicker: 'Feed Kicker',
    feedTitle: 'Feed Title',
    feedDescription: 'Feed Description',
    ctaTitle: 'CTA Title',
    ctaDescription: 'CTA Description',
    primaryCta: 'Explore Products',
    secondaryCta: 'Brochures',
  },
  SOCIAL_PAGE_POSTS: [
    {
      id: 'post-1',
      image: '/images/social/post1.jpg',
      title: 'Post 1 Title',
      caption: 'Post 1 Caption',
      productSlug: 'slug-1',
    },
    {
      id: 'post-2',
      image: '/images/social/post2.jpg',
      title: 'Post 2 Title',
      caption: 'Post 2 Caption',
      productSlug: 'non-existent',
    },
  ],
}));

vi.mock('@/lib/catalog/site/getProducts', () => ({
  getProducts: vi.fn().mockResolvedValue([
    {
      id: 'prod-1',
      slug: 'slug-1',
      category_id: 'seating',
      name: 'Seating Product',
    },
  ]),
}));

describe('SocialPage Route', () => {
  it('renders correctly and matches products to posts', async () => {
    expect(metadata).toEqual({ title: 'Social Title' });

    const pageElement = await SocialPage();
    render(pageElement);

    // Verify introductory texts
    expect(screen.getByText('@oando.official')).toBeInTheDocument();
    expect(screen.getByText('Post 1 Title')).toBeInTheDocument();
    expect(screen.getByText('Post 1 Caption')).toBeInTheDocument();
    expect(screen.getByText('Post 2 Title')).toBeInTheDocument();
    expect(screen.getByText('Post 2 Caption')).toBeInTheDocument();

    // Verify resolved links
    const link1 = screen.getAllByRole('link', { name: /View related route/i })[0];
    const link2 = screen.getAllByRole('link', { name: /View related route/i })[1];
    expect(link1).toHaveAttribute('href', '/products/seating/slug-1');
    expect(link2).toHaveAttribute('href', '/products'); // fallback

    // Verify child components
    expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-section-intro')).toHaveLength(2);
    expect(screen.getByTestId('mock-cta-band')).toBeInTheDocument();
    expect(screen.getByTestId('mock-contact-teaser')).toBeInTheDocument();
  });
});
