import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomeFAQ } from '@/components/home/HomeFAQ';
import { HOMEPAGE_FAQ_CONTENT } from '@/features/site/data/homepage';

// Mock phosphor icons
vi.mock('@phosphor-icons/react', () => ({
  CaretDown: () => <span data-testid="caret-down" />
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: {
    div: ({ children, initial: _initial, animate: _animate, exit: _exit, variants: _variants, transition: _transition, whileInView: _whileInView, viewport: _viewport, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, initial: _initial, animate: _animate, exit: _exit, variants: _variants, transition: _transition, whileInView: _whileInView, viewport: _viewport, ...props }: any) => <span {...props}>{children}</span>,
    dl: ({ children, initial: _initial, animate: _animate, exit: _exit, variants: _variants, transition: _transition, whileInView: _whileInView, viewport: _viewport, ...props }: any) => <dl {...props}>{children}</dl>,
    dd: ({ children, initial: _initial, animate: _animate, exit: _exit, variants: _variants, transition: _transition, whileInView: _whileInView, viewport: _viewport, ...props }: any) => <dd {...props}>{children}</dd>
  }
}));

vi.mock('@/lib/helpers/motion', () => ({
  fadeUp: () => ({}),
  staggerContainer: {},
  staggerItem: {}
}));

describe('HomeFAQ Component', () => {
  it('renders list of questions and handles toggle details correctly', () => {
    render(<HomeFAQ />);

    // Verify Title
    expect(screen.getByText(HOMEPAGE_FAQ_CONTENT.titleLead)).toBeInTheDocument();

    // Verify first question exists but answer is hidden initially
    const firstFaq = HOMEPAGE_FAQ_CONTENT.items[0];
    const firstBtn = screen.getByRole('button', { name: firstFaq.q });
    expect(firstBtn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(firstFaq.a)).toBeNull();

    // Toggle first question
    fireEvent.click(firstBtn);
    expect(firstBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(firstFaq.a)).toBeInTheDocument();

    // Toggle first question again (closes it)
    fireEvent.click(firstBtn);
    expect(firstBtn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(firstFaq.a)).toBeNull();
  });
});
