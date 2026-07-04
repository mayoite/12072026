import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CollaborationSection } from '@/components/home/CollaborationSection';

vi.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="arrow-right" />
}));

describe('CollaborationSection Component', () => {
  it('renders correctly with layout details', () => {
    render(<CollaborationSection />);

    // Verify background image
    const img = screen.getByAltText('Collaborative office workspace designed by One&Only');
    expect(img).toHaveAttribute('src', '/images/hero/tvs-patna-hq.webp');

    // Verify headers
    expect(screen.getByText('Workspace Solutions')).toBeInTheDocument();
    expect(screen.getByText(/Space for/)).toBeInTheDocument();

    // Verify link destination
    const link = screen.getByRole('link', { name: /Explore workspace solutions/ });
    expect(link).toHaveAttribute('href', '/solutions');
  });
});
