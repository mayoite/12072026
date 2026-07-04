import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrustStrip } from '@/components/home/TrustStrip';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial: _initial, animate: _animate, variants: _variants, transition: _transition, whileInView: _whileInView, viewport: _viewport, ...props }: any) => <div {...props}>{children}</div>
  }
}));

vi.mock('@/lib/helpers/motion', () => ({
  staggerContainer: {},
  staggerItem: {}
}));

vi.mock('@/components/home/KpiCounter', () => ({
  KpiCounter: ({ value, className }: any) => (
    <span data-testid="mock-kpi-counter" className={className}>
      Value: {value}
    </span>
  )
}));

describe('TrustStrip Component', () => {
  const stats = {
    yearsExperience: 10,
    projectsDelivered: 500,
    clientOrganisations: 120,
    locationsServed: 15
  };

  it('renders section and stats grid correctly by default', () => {
    render(<TrustStrip stats={stats} />);

    // Verify main section
    expect(screen.getByTestId('home-trust')).toBeInTheDocument();

    // Verify KPI elements are rendered
    expect(screen.getByTestId('kpi-years-experience')).toHaveTextContent('Value: 10');
    expect(screen.getByText('Years of experience')).toBeInTheDocument();

    expect(screen.getByTestId('kpi-projects-delivered')).toHaveTextContent('Value: 500');
    expect(screen.getByText('Projects completed')).toBeInTheDocument();

    expect(screen.getByTestId('kpi-client-organisations')).toHaveTextContent('Value: 120');
    expect(screen.getByText('Corporate clients')).toBeInTheDocument();

    expect(screen.getByTestId('kpi-locations-served')).toHaveTextContent('Value: 15');
    expect(screen.getByText('Locations serviced')).toBeInTheDocument();
  });

  it('renders embedded style without outer section', () => {
    render(<TrustStrip stats={stats} embedded={true} />);

    expect(screen.queryByTestId('home-trust')).toBeNull();
    // But stats are still there
    expect(screen.getByTestId('kpi-years-experience')).toHaveTextContent('Value: 10');
  });
});
