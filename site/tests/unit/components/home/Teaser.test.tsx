import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Teaser } from '@/components/home/Teaser';

vi.mock('@/components/shared/Reveal', () => ({
  Reveal: ({ children }: any) => <div data-testid="reveal">{children}</div>
}));

describe('Teaser Component', () => {
  it('renders standard text and image correctly', () => {
    render(
      <Teaser
        title="Ergonomic Comfort"
        subtitle="Seating"
        description="Premium office chair design."
        linkText="Explore Chair"
        linkUrl="/seating"
        imageSrc="/chair.jpg"
        imageAlt="Fluid Chair"
      />
    );

    expect(screen.getByText('Ergonomic Comfort')).toBeInTheDocument();
    expect(screen.getByText('Seating')).toBeInTheDocument();
    expect(screen.getByText('Premium office chair design.')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Explore Chair/ });
    expect(link).toHaveAttribute('href', '/seating');

    const img = screen.getByAltText('Fluid Chair');
    expect(img).toHaveAttribute('src', '/chair.jpg');
  });

  it('renders video if videoSrc is provided', () => {
    const { container } = render(
      <Teaser
        title="Promo Video"
        videoSrc="/teaser-video.mp4"
      />
    );

    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    const source = video?.querySelector('source');
    expect(source).toHaveAttribute('src', '/teaser-video.mp4');
  });

  it('applies reverse styling classes when reversed is true', () => {
    const { container } = render(
      <Teaser
        title="Reversed Layout"
        reversed={true}
      />
    );

    const layoutDiv = container.querySelector('.flex-col');
    expect(layoutDiv).toHaveClass('md:flex-row-reverse');
  });

  it('applies lightMode theme classes when lightMode is true', () => {
    const { container } = render(
      <Teaser
        title="Light Layout"
        lightMode={true}
      />
    );

    expect(container.firstChild).toHaveClass('bg-panel');
    expect(container.firstChild).toHaveClass('text-strong');
  });
});
