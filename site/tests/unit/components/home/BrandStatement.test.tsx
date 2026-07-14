import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrandStatement } from '@/components/home/BrandStatement';
import { HOMEPAGE_BRAND_STATEMENT_CONTENT } from '@/features/site/data/homepage';

vi.mock('@/components/shared/Reveal', () => ({
  Reveal: ({ children }: any) => <div data-testid="reveal">{children}</div>
}));

describe('BrandStatement Component', () => {
  it('renders brand statement details correctly', () => {
    render(<BrandStatement />);
    expect(screen.getByTestId('reveal')).toBeInTheDocument();
    expect(screen.getByText(HOMEPAGE_BRAND_STATEMENT_CONTENT.lead)).toBeInTheDocument();
    expect(screen.getByText(HOMEPAGE_BRAND_STATEMENT_CONTENT.body)).toBeInTheDocument();
  });
});
