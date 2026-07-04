import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Hotspot } from '@/components/ui/HotspotImage';
import { HotspotImage } from '@/components/ui/HotspotImage';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial: _initial, animate: _animate, exit: _exit, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('lucide-react', () => ({
  Plus: ({ className }: { className: string }) => <span data-testid="plus-icon" className={className} />,
}));

const mockHotspots: Hotspot[] = [
  {
    id: 'spot1',
    x: 25,
    y: 40,
    title: 'Ergonomic Chair',
    description: 'High-back ergonomic mesh chair with lumbar support.',
    linkUrl: '/products/chair',
  },
  {
    id: 'spot2',
    x: 60,
    y: 75,
    description: 'Solid wood desk organizer.',
  },
];

describe('HotspotImage Component', () => {
  it('renders the base image correctly', () => {
    render(<HotspotImage src="/test-image.jpg" alt="Office view" hotspots={mockHotspots} />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test-image.jpg');
    expect(img).toHaveAttribute('alt', 'Office view');
  });

  it('renders hotspots at correct styled positions', () => {
    const { container: _container } = render(<HotspotImage src="/test-image.jpg" alt="Office view" hotspots={mockHotspots} />);

    // Note: there are pulse spans and tooltips inside, let's find the wrappers styled with top/left
    const spot1Wrapper = screen.getByTitle('View details for Ergonomic Chair').parentElement;
    const spot2Wrapper = screen.getByTitle('View details for spot2').parentElement;

    expect(spot1Wrapper).toHaveStyle({ top: '40%', left: '25%' });
    expect(spot2Wrapper).toHaveStyle({ top: '75%', left: '60%' });
  });

  it('opens and closes tooltips on hotspot click', () => {
    render(<HotspotImage src="/test-image.jpg" alt="Office view" hotspots={mockHotspots} />);

    const button1 = screen.getByRole('button', { name: 'View details for Ergonomic Chair' });
    const button2 = screen.getByRole('button', { name: 'View details for spot2' });

    // Initially tooltips are not visible
    expect(screen.queryByText('High-back ergonomic mesh chair with lumbar support.')).not.toBeInTheDocument();

    // Click first hotspot
    fireEvent.click(button1);
    expect(screen.getByText('Ergonomic Chair')).toBeInTheDocument();
    expect(screen.getByText('High-back ergonomic mesh chair with lumbar support.')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Explore Product →' });
    expect(link).toHaveAttribute('href', '/products/chair');

    // Click same hotspot again to close it
    fireEvent.click(button1);
    expect(screen.queryByText('High-back ergonomic mesh chair with lumbar support.')).not.toBeInTheDocument();

    // Click second hotspot (no title, no link)
    fireEvent.click(button2);
    expect(screen.getByText('Solid wood desk organizer.')).toBeInTheDocument();
    expect(screen.queryByText('Explore Product →')).not.toBeInTheDocument();
  });
});
