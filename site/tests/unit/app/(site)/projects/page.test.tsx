import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectsPage, { metadata } from '@/app/(site)/projects/page';

// Mock components
vi.mock('@/components/home/Hero', () => ({
  Hero: ({ title, subtitle }: any) => (
    <div data-testid="mock-hero">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </div>
  ),
}));

vi.mock('@/components/ClientBadge', () => ({
  ClientBadge: ({ name }: any) => <div data-testid="mock-client-badge">{name}</div>,
}));

vi.mock('@/components/analytics/KpiIntegrityMonitor', () => ({
  KpiIntegrityMonitor: () => <div data-testid="mock-kpi-monitor">KPI Monitor</div>,
}));

vi.mock('@/components/shared/ContactTeaser', () => ({
  ContactTeaser: () => <div data-testid="mock-contact-teaser">Contact Teaser</div>,
}));

// Mock metadata and copy
vi.mock('@/features/site/data/routeMetadata', () => ({
  PROJECTS_PAGE_METADATA: { title: 'Projects' },
}));

vi.mock('@/features/site/data/routeCopy', () => ({
  PROJECTS_PAGE_COPY: {
    heroTitle: 'Our Projects',
    heroSubtitleTemplate: 'Serving {clients} client organizations.',
    heroBackgroundImage: '/images/hero/projects-test.webp',
    featuredLabel: 'Featured',
    featuredTitle: 'Featured Projects',
    allLabel: 'All Clients',
  },
  PROJECTS_PAGE_CLIENTS: [
    { name: 'Client 1' },
    { name: 'Client 2' },
    { name: 'Client 3' },
    { name: 'Client 4' },
    { name: 'Client 5' },
    { name: 'Client 6' },
    { name: 'Client 7' },
    { name: 'Client 8' },
    { name: 'Client 9' },
    { name: 'Client 10' },
    { name: 'Client 11' },
    { name: 'Client 12' },
    { name: 'Client 13' },
  ],
}));

// Mock businessStats
vi.mock('@/features/crm/businessStats', () => ({
  getBusinessStats: vi.fn(async () => ({
    stats: {
      clientOrganisations: 100,
      projectsDelivered: 500,
      sectorsServed: 10,
      asOfDate: '2026-06-26',
    },
    source: 'supabase',
  })),
}));

// Mock format helpers
vi.mock('@/lib/kpiFormat', () => ({
  formatKpiValuePlus: (val: any) => `${val}+`,
  formatKpiAsOf: (date: any) => `As of ${date}`,
}));

describe('ProjectsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders metadata and content correctly', async () => {
    expect(metadata).toEqual({ title: 'Projects' });

    const pageElement = await ProjectsPage();
    render(pageElement);

    expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
    expect(screen.getByText('Our Projects')).toBeInTheDocument();
    expect(screen.getByText('Serving 100+ client organizations.')).toBeInTheDocument();

    expect(screen.getByTestId('kpi-client-organisations-projects')).toHaveTextContent('100+');
    expect(screen.getByTestId('kpi-projects-delivered-projects')).toHaveTextContent('500+');
    expect(screen.getByTestId('kpi-sectors-served-projects')).toHaveTextContent('10+');
    expect(screen.getByTestId('kpi-as-of-projects')).toHaveTextContent('As of 2026-06-26');

    // Check Client Badges render
    expect(screen.getAllByTestId('mock-client-badge').length).toBe(13);
    expect(screen.getByTestId('mock-contact-teaser')).toBeInTheDocument();
  });
});
