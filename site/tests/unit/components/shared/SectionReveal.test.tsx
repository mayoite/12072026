import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionReveal } from '@/components/shared/SectionReveal';

let mockReduced = false;
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, transition, initial: _initial, animate: _animate, variants: _variants, whileInView: _whileInView, viewport: _viewport, ...props }: any) => (
      <div data-testid="reveal-div" data-transition={JSON.stringify(transition)} {...props}>
        {children}
      </div>
    ),
  },
  useReducedMotion: () => mockReduced,
}));

vi.mock('@/lib/helpers/motion', () => ({
  MOTION_EASE: [0.1, 0.2, 0.3, 0.4],
}));

describe('SectionReveal Component', () => {
  beforeEach(() => {
    mockReduced = false;
  });

  it('renders children correctly with transition details when motion is enabled', () => {
    render(
      <SectionReveal delay={0.3} distance={20}>
        <span>Inside Content</span>
      </SectionReveal>
    );

    expect(screen.getByText('Inside Content')).toBeInTheDocument();
    
    const wrapper = screen.getByTestId('reveal-div');
    const transition = JSON.parse(wrapper.getAttribute('data-transition') || '{}');
    
    expect(transition.duration).toBe(0.5);
    expect(transition.delay).toBe(0.3);
    expect(transition.ease).toEqual([0.1, 0.2, 0.3, 0.4]);
  });

  it('bypasses animations when reduced motion is preferred', () => {
    mockReduced = true;

    render(
      <SectionReveal delay={0.5} distance={10}>
        <span>Static Content</span>
      </SectionReveal>
    );

    const wrapper = screen.getByTestId('reveal-div');
    const transition = JSON.parse(wrapper.getAttribute('data-transition') || '{}');
    
    expect(transition.duration).toBe(0);
    expect(transition.delay).toBe(0);
  });
});
