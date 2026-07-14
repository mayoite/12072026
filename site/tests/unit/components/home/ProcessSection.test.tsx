import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProcessSection } from '@/components/home/ProcessSection';
import { HOMEPAGE_PROCESS_CONTENT } from '@/features/site/data/homepage';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial: _initial, animate: _animate, variants: _variants, transition: _transition, whileInView: _whileInView, viewport: _viewport, ...props }: any) => <div {...props}>{children}</div>
  }
}));

describe('ProcessSection Component', () => {
  it('renders dark background and processes correctly by default', () => {
    const { container } = render(<ProcessSection />);

    // Verify dark class
    expect(container.firstChild).toHaveClass('bg-[var(--color-dark-midnight-blue-900)]');
    expect(container.firstChild).toHaveClass('text-white');

    // Verify title
    expect(screen.getByText(HOMEPAGE_PROCESS_CONTENT.titleLead)).toBeInTheDocument();
    expect(screen.getByText(HOMEPAGE_PROCESS_CONTENT.titleAccent)).toBeInTheDocument();

    // Verify steps details
    HOMEPAGE_PROCESS_CONTENT.steps.forEach((step, _index) => {
      expect(screen.getByText(step.title)).toBeInTheDocument();
      expect(screen.getByText(step.sla)).toBeInTheDocument();
      expect(screen.getByText(step.deliverable)).toBeInTheDocument();
    });
  });

  it('renders light background when dark is false', () => {
    const { container } = render(<ProcessSection dark={false} />);
    expect(container.firstChild).toHaveClass('bg-panel');
    expect(container.firstChild).toHaveClass('text-body');
  });
});
