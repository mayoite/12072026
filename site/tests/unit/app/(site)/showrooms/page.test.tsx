import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ShowroomsPage, { metadata } from '@/app/(site)/showrooms/page';

// Mock components
vi.mock('@/components/home/Hero', () => ({
  Hero: ({ title, subtitle }: any) => (
    <div data-testid="mock-hero">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </div>
  ),
}));

vi.mock('@/components/home/FeaturedCarousel', () => ({
  FeaturedCarousel: () => <div data-testid="mock-carousel">Featured Carousel</div>,
}));

vi.mock('@/components/home/BrandStatement', () => ({
  BrandStatement: () => <div data-testid="mock-brand-statement">Brand Statement</div>,
}));

vi.mock('@/components/home/CollaborationSection', () => ({
  CollaborationSection: () => <div data-testid="mock-collaboration">Collaboration Section</div>,
}));

vi.mock('@/components/home/ClientQuote', () => ({
  ClientQuote: () => <div data-testid="mock-client-quote">Client Quote</div>,
}));

vi.mock('@/components/home/Teaser', () => ({
  Teaser: ({ title }: any) => <div data-testid="mock-teaser">{title}</div>,
}));

vi.mock('@/components/shared/ContactTeaser', () => ({
  ContactTeaser: () => <div data-testid="mock-contact-teaser">Contact Teaser</div>,
}));

// Mock routeMetadata and routeCopy
vi.mock('@/lib/site-data/routeMetadata', () => ({
  SHOWROOMS_PAGE_METADATA: { title: 'Showrooms Title' },
}));

vi.mock('@/lib/site-data/routeCopy', () => ({
  SHOWROOMS_CLIENTS: ['Client A', 'Client B'],
  SHOWROOMS_HIGHLIGHTS: [
    { title: 'Highlight 1', detail: 'Detail 1' },
    { title: 'Highlight 2', detail: 'Detail 2' },
  ],
  SHOWROOMS_PAGE_COPY: {
    heroTitle: 'Hero Title',
    heroSubtitle: 'Hero Subtitle',
    trustedKicker: 'Trusted Kicker',
    aboutKicker: 'About Kicker',
    aboutTitle: 'About Title',
    aboutDescription: 'About Description',
    clientsKicker: 'Clients Kicker',
    clientsCta: 'Clients CTA',
    highlightsKicker: 'Highlights Kicker',
    highlightsCta: 'Highlights CTA',
    sustainabilityTitle: 'Sustainability Title',
    sustainabilitySubtitle: 'Sustainability Subtitle',
    sustainabilityDescription: 'Sustainability Description',
    sustainabilityCta: 'Sustainability CTA',
  },
}));

vi.mock('@/features/crm/businessStats', () => ({
  getBusinessStats: vi.fn().mockResolvedValue({
    stats: {
      asOfDate: '2026-01-01',
      clientOrganisations: 120,
      projectsDelivered: 450,
      sectorsServed: 12,
    },
  }),
}));

vi.mock('@/lib/kpiFormat', () => ({
  formatKpiAsOf: (date: string) => `As of ${date}`,
  formatKpiValuePlus: (val: number) => `${val}+`,
}));

describe('ShowroomsPage Route', () => {
  it('renders correctly with mocked kpis and child components', async () => {
    expect(metadata).toEqual({ title: 'Showrooms Title' });

    const pageElement = await ShowroomsPage();
    render(pageElement);

    // Verify Business stats and formatters were used
    expect(screen.getByText('As of 2026-01-01')).toBeInTheDocument();
    expect(screen.getByText('120+')).toBeInTheDocument();
    expect(screen.getByText('450+')).toBeInTheDocument();
    expect(screen.getByText('12+')).toBeInTheDocument();

    // Verify sections and text copy
    expect(screen.getAllByText('About Title').length).toBeGreaterThan(0);
    expect(screen.getAllByText('About Description').length).toBeGreaterThan(0);

    // Verify clients
    expect(screen.getByText('Client A')).toBeInTheDocument();
    expect(screen.getByText('Client B')).toBeInTheDocument();

    // Verify highlights
    expect(screen.getByText('Highlight 1')).toBeInTheDocument();
    expect(screen.getByText('Highlight 2')).toBeInTheDocument();

    // Verify child components
    expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
    expect(screen.getByTestId('mock-teaser')).toBeInTheDocument();
    expect(screen.getByTestId('mock-contact-teaser')).toBeInTheDocument();
  });
});
