import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SafeImage } from '@/components/SafeImage';

describe('SafeImage Component', () => {
  it('renders standard source correctly', () => {
    render(<SafeImage src="/valid-image.jpg" alt="Valid alt text" />);
    const img = screen.getByAltText('Valid alt text');
    expect(img).toHaveAttribute('src', '/valid-image.jpg');
  });

  it('renders fallback if src is not provided', () => {
    render(<SafeImage alt="Fallback test" />);
    const img = screen.getByAltText('Fallback test');
    expect(img).toHaveAttribute('src', '/images/products/60x30-workstation-1.webp');
  });

  it('renders custom fallbackSrc if provided and src is null', () => {
    render(<SafeImage src={null} alt="Custom fallback test" fallbackSrc="/custom-fallback.jpg" />);
    const img = screen.getByAltText('Custom fallback test');
    expect(img).toHaveAttribute('src', '/custom-fallback.jpg');
  });

  it('switches to fallback image on error', () => {
    render(<SafeImage src="/broken.jpg" alt="Error recovery test" fallbackSrc="/recovery.jpg" />);
    const img = screen.getByAltText('Error recovery test');
    expect(img).toHaveAttribute('src', '/broken.jpg');

    // Trigger error
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', '/recovery.jpg');
  });

  it('merges style objects when priority is not true', () => {
    const customStyle = { border: '1px solid red' };
    render(<SafeImage src="/valid-image.jpg" alt="Style test" style={customStyle} />);
    const img = screen.getByAltText('Style test');
    
    // Non-priority should have contentVisibility/containIntrinsicSize merged
    // In React testing library, style matches computed styling
    expect(img.style.contentVisibility).toBe('auto');
    expect(img.style.containIntrinsicSize).toBe('auto 20rem');
    expect(img.style.border).toBe('1px solid red');
  });

  it('does not merge contentVisibility style when priority is true', () => {
    const customStyle = { border: '1px solid red' };
    render(<SafeImage src="/valid-image.jpg" alt="Priority style test" priority style={customStyle} />);
    const img = screen.getByAltText('Priority style test');
    
    expect(img.style.contentVisibility).toBe('');
    expect(img.style.containIntrinsicSize).toBe('');
    expect(img.style.border).toBe('1px solid red');
  });
});
