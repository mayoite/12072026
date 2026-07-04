import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SupportIvrPageView } from '@/components/support/SupportIvrPageView';
import { SUPPORT_IVR_PAGE_COPY } from '@/lib/site-data/routeCopy';

vi.mock('@/components/home/Hero', () => ({
  Hero: ({ title, subtitle, backgroundImage, showButton }: any) => (
    <div data-testid="mock-hero" data-bg={backgroundImage} data-showbutton={showButton}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
}));

vi.mock('@/components/shared/SectionIntro', () => ({
  SectionIntro: ({ kicker, title, description, className, maxWidthClassName }: any) => (
    <div data-testid="mock-section-intro" className={className} data-maxwidth={maxWidthClassName}>
      <span>{kicker}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  ),
}));

vi.mock('@/components/support/VisualIVR', () => ({
  VisualIVR: () => <div data-testid="mock-visual-ivr">Visual IVR Component</div>,
}));

vi.mock('@/components/shared/ContactTeaser', () => ({
  ContactTeaser: () => <div data-testid="mock-contact-teaser">Contact Teaser Component</div>,
}));

describe('SupportIvrPageView Component', () => {
  it('renders correctly with all subcomponents and correct copy', () => {
    render(<SupportIvrPageView />);

    const hero = screen.getByTestId('mock-hero');
    expect(hero).toBeInTheDocument();
    expect(hero).toHaveTextContent(SUPPORT_IVR_PAGE_COPY.heroTitle);
    expect(hero).toHaveTextContent(SUPPORT_IVR_PAGE_COPY.heroSubtitle);
    expect(hero.getAttribute('data-bg')).toBe('/images/hero/hero-3.webp');
    expect(hero.getAttribute('data-showbutton')).toBe('false');

    const intro = screen.getByTestId('mock-section-intro');
    expect(intro).toBeInTheDocument();
    expect(intro).toHaveTextContent(SUPPORT_IVR_PAGE_COPY.introKicker);
    expect(intro).toHaveTextContent(SUPPORT_IVR_PAGE_COPY.introTitle);
    expect(intro).toHaveTextContent(SUPPORT_IVR_PAGE_COPY.introDescription);
    expect(intro.getAttribute('data-maxwidth')).toBe('max-w-4xl');

    expect(screen.getByTestId('mock-visual-ivr')).toBeInTheDocument();
    expect(screen.getByTestId('mock-contact-teaser')).toBeInTheDocument();

    // Verify note card copy
    expect(screen.getByText(SUPPORT_IVR_PAGE_COPY.noteTitle)).toBeInTheDocument();
    expect(screen.getByText(SUPPORT_IVR_PAGE_COPY.noteDescription)).toBeInTheDocument();
  });
});
