import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClientQuote } from '@/components/home/ClientQuote';

describe('ClientQuote Component', () => {
  it('renders client quote section with correct text copy', () => {
    render(<ClientQuote />);
    expect(screen.getByText('What our clients say')).toBeInTheDocument();
    expect(screen.getByText(/They delivered exactly what we specified/i)).toBeInTheDocument();
    expect(screen.getByText('Procurement Head')).toBeInTheDocument();
    expect(screen.getByText('Delhi Metro Rail Corporation')).toBeInTheDocument();
  });
});
