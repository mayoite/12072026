import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LoginForm } from '@/app/(site)/login/LoginForm';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('next=/dashboard'),
}));

describe('app/(site)/login/LoginForm.tsx', () => {
  it('renders sign-in form and guest link', async () => {
    render(<LoginForm guestHref="/choose-product?mode=guest" />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sign in to your workspace/i })).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Continue as guest/i })).toHaveAttribute(
      'href',
      '/choose-product?mode=guest',
    );
  });
});
