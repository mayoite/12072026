import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryImage } from '@/components/home/CategoryImage';

describe('CategoryImage Component', () => {
  it('renders standard source correctly', () => {
    render(<CategoryImage src="/test-cat.jpg" alt="Seating Category" />);
    const img = screen.getByAltText('Seating Category');
    expect(img).toHaveAttribute('src', '/test-cat.jpg');
  });

  it('renders fallback if src is empty', () => {
    render(<CategoryImage src="" alt="Seating Category Fallback" />);
    const img = screen.getByAltText('Seating Category Fallback');
    expect(img).toHaveAttribute('src', '/images/catalog/oando-workstations--deskpro/image-1.jpg');
  });

  it('switches to fallback image on error', () => {
    render(<CategoryImage src="/broken-cat.jpg" alt="Seating Category Error" />);
    const img = screen.getByAltText('Seating Category Error');
    expect(img).toHaveAttribute('src', '/broken-cat.jpg');

    fireEvent.error(img);
    expect(img).toHaveAttribute('src', '/images/catalog/oando-workstations--deskpro/image-1.jpg');
  });
});
