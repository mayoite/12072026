import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FilterGrid } from '@/app/(site)/products/[category]/FilterGrid';

vi.mock('@/app/(site)/products/[category]/FilterGridInner', () => ({
  AdvancedFilterGridInner: ({ category, categoryId }: any) => (
    <div data-testid="inner-grid" data-category={category.name} data-category-id={categoryId}>
      Advanced Filter Grid Inner
    </div>
  ),
}));

describe('FilterGrid Component', () => {
  it('renders the suspended inner filter grid', async () => {
    const mockCategory = {
      id: 'seating',
      name: 'Seating',
      series: [],
    };

    render(<FilterGrid category={mockCategory as any} categoryId="seating" />);

    const innerGrid = screen.getByTestId('inner-grid');
    expect(innerGrid).toBeInTheDocument();
    expect(innerGrid).toHaveAttribute('data-category', 'Seating');
    expect(innerGrid).toHaveAttribute('data-category-id', 'seating');
  });
});
