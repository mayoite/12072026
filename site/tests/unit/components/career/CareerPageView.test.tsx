import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CareerPageView } from '@/components/career/CareerPageView';
import { CAREER_PAGE_COPY } from '@/features/site/data/routeCopy';

vi.mock('@/components/home/Hero', () => ({
  Hero: ({ title, subtitle }: any) => (
    <div data-testid="mock-hero">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  )
}));

vi.mock('@/components/career/JobCard', () => ({
  JobCard: ({ title, department, location }: any) => (
    <div data-testid="mock-job-card">
      <h4>{title}</h4>
      <span>{department} - {location}</span>
    </div>
  )
}));

vi.mock('@/components/shared/ContactTeaser', () => ({
  ContactTeaser: () => <div data-testid="mock-contact-teaser" />
}));

vi.mock('@phosphor-icons/react', () => ({
  Users: () => <span data-testid="users-icon" />,
  GraduationCap: () => <span data-testid="graduation-icon" />,
  Briefcase: () => <span data-testid="briefcase-icon" />
}));

describe('CareerPageView Component', () => {
  it('renders all sections and mocked child components correctly', () => {
    render(<CareerPageView />);

    // Verify Hero is rendered
    expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
    expect(screen.getByText(CAREER_PAGE_COPY.heroTitle)).toBeInTheDocument();

    // Verify Pillars
    CAREER_PAGE_COPY.pillars.forEach((pillar) => {
      expect(screen.getByText(pillar.title)).toBeInTheDocument();
      expect(screen.getByText(pillar.detail)).toBeInTheDocument();
    });

    // Verify Process Steps
    CAREER_PAGE_COPY.processSteps.forEach((step) => {
      expect(screen.getByText(step.title)).toBeInTheDocument();
      expect(screen.getByText(step.detail)).toBeInTheDocument();
    });

    // Verify JobCards
    const jobCards = screen.getAllByTestId('mock-job-card');
    expect(jobCards.length).toBeGreaterThan(0);

    // Verify contact email link
    const mailLink = screen.getByRole('link', { name: CAREER_PAGE_COPY.careersEmail });
    expect(mailLink).toHaveAttribute('href', `mailto:${CAREER_PAGE_COPY.careersEmail}`);

    // Verify ContactTeaser
    expect(screen.getByTestId('mock-contact-teaser')).toBeInTheDocument();
  });
});
