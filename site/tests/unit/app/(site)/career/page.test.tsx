import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '@/app/(site)/career/page';

vi.mock('@/components/career/CareerPageView', () => ({
  CareerPageView: () => <div data-testid="CareerPageView" />
}));

describe('app/(site)/career/page.tsx', () => {
  it('renders successfully with career JobPosting JSON-LD', () => {
    const { container } = render(<Page />);
    expect(screen.getByTestId('CareerPageView')).toBeInTheDocument();
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBeGreaterThanOrEqual(2);
    const payloads = [...scripts].map((el) => el.innerHTML);
    expect(payloads.some((p) => p.includes('JobPosting'))).toBe(true);
    expect(payloads.some((p) => p.includes('WebPage'))).toBe(true);
  });
});
