import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ShowroomsPage, { metadata } from '@/app/(site)/showrooms/page';

vi.mock('@/features/site/data/routeMetadata', () => ({
  SHOWROOMS_PAGE_METADATA: { title: 'Showrooms Title' },
}));

vi.mock('@/features/site/data/routeCopy', () => ({
  SHOWROOMS_HIGHLIGHTS: [
    { title: 'Highlight 1', detail: 'Detail 1' },
    { title: 'Highlight 2', detail: 'Detail 2' },
  ],
}));

describe('ShowroomsPage Route', () => {
  it('renders correctly with mocked kpis and child components', () => {
    expect(metadata).toEqual({ title: 'Showrooms Title' });

    render(<ShowroomsPage />);

    expect(screen.getByText(/See how work/i)).toBeInTheDocument();
    expect(screen.getByText(/comes together/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Visit One&Only' })).toBeInTheDocument();
    expect(screen.getByText('Highlight 1')).toBeInTheDocument();
    expect(screen.getByText('Highlight 2')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Book a visit' })).toHaveAttribute(
      'href',
      '/contact?intent=visit&source=showrooms',
    );
    expect(screen.getByTestId('home-marketing-layout')).toBeInTheDocument();
  });
});
