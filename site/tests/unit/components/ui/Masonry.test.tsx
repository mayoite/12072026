import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Masonry, MasonryItem } from '@/components/ui/Masonry';

describe('Masonry and MasonryItem Components', () => {
  it('renders Masonry wrapper with default columns and gap style', () => {
    const { container } = render(
      <Masonry>
        <div>Child 1</div>
        <div>Child 2</div>
      </Masonry>
    );

    const root = container.firstChild as HTMLElement;
    expect(root).toBeInTheDocument();
    expect(root).toHaveStyle({
      columnCount: '3',
      columnGap: '2rem',
    });
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('renders Masonry wrapper with custom columns, gap and className', () => {
    const { container } = render(
      <Masonry columns={4} gap="1.5rem" className="custom-masonry">
        <div>Child</div>
      </Masonry>
    );

    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('custom-masonry');
    expect(root).toHaveStyle({
      columnCount: '4',
      columnGap: '1.5rem',
    });
  });

  it('renders MasonryItem with correct break-inside styles and className', () => {
    const { container } = render(
      <MasonryItem className="custom-item">
        <span>Item Content</span>
      </MasonryItem>
    );

    const item = container.firstChild as HTMLElement;
    expect(item).toBeInTheDocument();
    expect(item).toHaveClass('custom-item');
    expect(item).toHaveClass('break-inside-avoid');
    expect(item).toHaveStyle({
      breakInside: 'avoid',
    });
    expect(screen.getByText('Item Content')).toBeInTheDocument();
  });
});
