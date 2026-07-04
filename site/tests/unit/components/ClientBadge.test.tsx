import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClientBadge } from '@/components/ClientBadge';

describe('ClientBadge Component', () => {
  it('renders name and sector correctly', () => {
    const { container } = render(<ClientBadge name="Acme Corp" sector="Tech" />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(container.querySelector('.client-badge__location')).toBeNull();
  });

  it('renders location if provided', () => {
    render(<ClientBadge name="Acme Corp" sector="Tech" location="New York" />);
    expect(screen.getByText('New York')).toBeInTheDocument();
  });

  it('applies featured class if featured is true', () => {
    const { container } = render(<ClientBadge name="Acme Corp" sector="Tech" featured={true} />);
    const badge = container.querySelector('.client-badge');
    expect(badge?.classList.contains('client-badge--featured')).toBe(true);
  });

  it('does not apply featured class if featured is false', () => {
    const { container } = render(<ClientBadge name="Acme Corp" sector="Tech" featured={false} />);
    const badge = container.querySelector('.client-badge');
    expect(badge?.classList.contains('client-badge--featured')).toBe(false);
  });
});
