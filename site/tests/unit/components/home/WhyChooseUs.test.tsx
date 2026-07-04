import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { HOMEPAGE_WHY_CHOOSE_US_CONTENT } from '@/lib/site-data/homepage';

// Mock phosphor icons
vi.mock('@phosphor-icons/react', () => ({
  Gauge: () => <span data-testid="gauge-icon" />,
  ShieldCheck: () => <span data-testid="shield-icon" />,
  Plant: () => <span data-testid="plant-icon" />,
  Stack: () => <span data-testid="stack-icon" />
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial: _initial, animate: _animate, variants: _variants, transition: _transition, whileInView: _whileInView, whileHover: _whileHover, viewport: _viewport, ...props }: any) => <div {...props}>{children}</div>
  }
}));

vi.mock('@/lib/helpers/motion', () => ({
  fadeUp: () => ({}),
  hoverLift: {},
  staggerContainer: {},
  staggerItem: {}
}));

describe('WhyChooseUs Component', () => {
  it('renders title and choose us features correctly', () => {
    render(<WhyChooseUs />);

    // Verify Title
    expect(screen.getByText(HOMEPAGE_WHY_CHOOSE_US_CONTENT.titleLead)).toBeInTheDocument();
    expect(screen.getByText(HOMEPAGE_WHY_CHOOSE_US_CONTENT.titleAccent)).toBeInTheDocument();

    // Verify key features
    expect(screen.getByText('Performance-graded')).toBeInTheDocument();
    expect(screen.getByText('Load, cycle, ergonomics')).toBeInTheDocument();
    expect(screen.getByTestId('gauge-icon')).toBeInTheDocument();

    expect(screen.getByText('Enterprise durability')).toBeInTheDocument();
    expect(screen.getByText('BIFMA · 5-year warranty')).toBeInTheDocument();
    expect(screen.getByTestId('shield-icon')).toBeInTheDocument();

    expect(screen.getByText('Sustainable build')).toBeInTheDocument();
    expect(screen.getByText('Low-emission materials')).toBeInTheDocument();
    expect(screen.getByTestId('plant-icon')).toBeInTheDocument();

    expect(screen.getByText('Scales with you')).toBeInTheDocument();
    expect(screen.getByText('Pilot to rollout')).toBeInTheDocument();
    expect(screen.getByTestId('stack-icon')).toBeInTheDocument();
  });
});
