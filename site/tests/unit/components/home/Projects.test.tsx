import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Projects } from '@/components/home/Projects';
import { HOMEPAGE_PROJECTS_CONTENT } from '@/lib/site-data/homepage';

vi.mock('@phosphor-icons/react', () => ({
  ArrowRight: () => <span data-testid="arrow-right" />
}));

describe('Projects Component', () => {
  it('renders section and project links correctly', () => {
    render(<Projects />);

    // Verify Title
    expect(screen.getByText(HOMEPAGE_PROJECTS_CONTENT.titleLead)).toBeInTheDocument();
    expect(screen.getByText(HOMEPAGE_PROJECTS_CONTENT.titleAccent)).toBeInTheDocument();

    // Verify project cards
    HOMEPAGE_PROJECTS_CONTENT.cards.forEach((project) => {
      expect(screen.getByText(project.name)).toBeInTheDocument();
      const projectImg = screen.getByAltText(project.name);
      expect(projectImg).toHaveAttribute('src', project.image);
    });

    // Verify overall CTA
    const mainCta = screen.getByRole('link', { name: new RegExp(HOMEPAGE_PROJECTS_CONTENT.cta.label) });
    expect(mainCta).toHaveAttribute('href', HOMEPAGE_PROJECTS_CONTENT.cta.href);
  });
});
