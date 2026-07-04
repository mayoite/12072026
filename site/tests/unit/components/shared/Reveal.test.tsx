import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Reveal } from '@/components/shared/Reveal';
import { useInView } from 'framer-motion';

// Mock framer-motion
const mockStart = vi.fn();
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div data-testid="motion-div" {...props}>{children}</div>,
  },
  useInView: vi.fn(),
  useAnimation: () => ({
    start: mockStart,
  }),
}));

vi.mock('@/lib/helpers/motion', () => ({
  MOTION_EASE: [0.1, 0.2, 0.3, 0.4],
}));

describe('Reveal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children correctly', () => {
    (useInView as any).mockReturnValue(false);

    render(
      <Reveal className="test-reveal">
        <span>Hidden Content</span>
      </Reveal>
    );

    expect(screen.getByText('Hidden Content')).toBeInTheDocument();
    expect(screen.getByTestId('motion-div')).toBeInTheDocument();
    expect(mockStart).not.toHaveBeenCalled();
  });

  it('triggers animation start when in view', () => {
    (useInView as any).mockReturnValue(true);

    render(
      <Reveal>
        <span>Visible Content</span>
      </Reveal>
    );

    expect(screen.getByText('Visible Content')).toBeInTheDocument();
    expect(mockStart).toHaveBeenCalledWith('visible');
  });
});
