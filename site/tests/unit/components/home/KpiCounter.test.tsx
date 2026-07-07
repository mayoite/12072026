import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { KpiCounter } from '@/components/home/KpiCounter';
import { useInView, useReducedMotion } from 'framer-motion';

vi.mock('framer-motion', () => ({
  useInView: vi.fn(),
  useReducedMotion: vi.fn()
}));

vi.mock('@/lib/kpiFormat', () => ({
  formatKpiValuePlus: vi.fn().mockImplementation((val) => `${val}+`)
}));

describe('KpiCounter Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders target value immediately when reduced motion is true', () => {
    vi.mocked(useInView).mockReturnValue(true);
    vi.mocked(useReducedMotion).mockReturnValue(true);

    render(<KpiCounter value={100} />);
    expect(screen.getByText('100+')).toBeInTheDocument();
  });

  it('does not animate or increment display value when not in view', () => {
    vi.mocked(useInView).mockReturnValue(false);
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(<KpiCounter value={100} />);
    expect(screen.getByText('100+')).toBeInTheDocument();
  });

  it('animates value from 0 to target when in view and motion is enabled', () => {
    vi.mocked(useInView).mockReturnValue(true);
    vi.mocked(useReducedMotion).mockReturnValue(false);

    // Mock requestAnimationFrame
    const callbacks: any[] = [];
    vi.stubGlobal('requestAnimationFrame', (cb: any) => {
      callbacks.push(cb);
      return callbacks.length;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    // Mock performance.now
    let nowVal = 0;
    vi.stubGlobal('performance', {
      now: () => nowVal
    });

    render(<KpiCounter value={100} />);
    
    // Initial display value is 0
    expect(screen.getByText('0+')).toBeInTheDocument();

    // Trigger first frame (progress 50%)
    nowVal = 1100;
    act(() => {
      callbacks[0]?.(1100);
    });

    // progress = 1100/2200 = 0.5. eased = 1 - (1 - 0.5)^3 = 1 - 0.125 = 0.875. Math.round(0.875 * 100) = 88
    expect(screen.getByText('88+')).toBeInTheDocument();

    // Trigger next frame (progress 100%)
    nowVal = 2200;
    act(() => {
      callbacks[1]?.(2200);
    });

    expect(screen.getByText('100+')).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
