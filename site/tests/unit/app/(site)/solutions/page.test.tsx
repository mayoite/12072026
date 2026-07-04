import type { ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SolutionsPage, { metadata } from '@/app/(site)/solutions/page';
import enMessages from '@/i18n/messages/en.json';

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

vi.mock('@/components/home/Hero', () => ({
  Hero: ({ title, subtitle }: { title: ReactNode; subtitle: string }) => (
    <div data-testid="mock-hero">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </div>
  ),
}));

vi.mock('@/components/shared/ContactTeaser', () => ({
  ContactTeaser: () => <div data-testid="mock-contact-teaser">Contact Teaser</div>,
}));

vi.mock('@/lib/site-data/routeMetadata', () => ({
  SOLUTIONS_PAGE_METADATA: { title: 'Solutions Title' },
}));

vi.mock('@/lib/site-data/homepage', () => ({
  DEFAULT_HERO_FALLBACK: '/fallback.jpg',
}));

const solutions = enMessages.solutions;

describe('SolutionsPage Route', () => {
  it('renders solutions content and delivery steps correctly', async () => {
    expect(metadata).toEqual({ title: 'Solutions Title' });

    const jsx = await SolutionsPage();
    render(jsx);

    expect(screen.getByText(solutions.heroTitleLead)).toBeInTheDocument();
    expect(screen.getByText(solutions.heroTitleAccent)).toBeInTheDocument();
    expect(screen.getByText(solutions.heroSubtitle)).toBeInTheDocument();
    expect(screen.getByText(solutions.deliveryTitle)).toBeInTheDocument();
    expect(screen.getByText(solutions.deliveryDescription)).toBeInTheDocument();

    expect(screen.getByText(solutions.stats[0].value)).toBeInTheDocument();
    expect(screen.getByText(solutions.stats[0].label)).toBeInTheDocument();

    expect(screen.getByText('Phase 1')).toBeInTheDocument();
    expect(screen.getByText(solutions.deliverySteps[0].title)).toBeInTheDocument();
    expect(screen.getByText(solutions.deliverySteps[0].detail)).toBeInTheDocument();

    expect(screen.getByRole('link', { name: solutions.planningPrimaryCta })).toHaveAttribute('href', '/contact');
    expect(screen.getByRole('link', { name: solutions.planningSecondaryCta })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: solutions.planningTertiaryCta })).toHaveAttribute('href', '/downloads');

    expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
    expect(screen.getByTestId('mock-contact-teaser')).toBeInTheDocument();
    expect(screen.getByTestId('home-marketing-layout')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="home-section"]')).toBeTruthy();
  });
});
