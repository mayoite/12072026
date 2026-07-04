import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductsError from '@/app/(site)/products/error';

describe('ProductsError', () => {
  it('renders the error message and calls reset on button click', () => {
    const error = new Error('Test error');
    const reset = vi.fn();
    
    // Mock console.error to avoid test output noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<ProductsError error={error} reset={reset} />);

    expect(screen.getByText('Unable to load products')).toBeInTheDocument();
    
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    expect(reset).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('[products-error]', error);

    consoleSpy.mockRestore();
  });
});
