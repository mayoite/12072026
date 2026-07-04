import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AccessForm } from '@/app/(site)/access/AccessForm';

describe('app/(site)/access/AccessForm.tsx', () => {
  it('renders sign-in form and guest link', () => {
    render(<AccessForm nextPath="/dashboard" guestHref="/choose-product?mode=guest" />);

    expect(screen.getByRole('heading', { name: /Welcome to Oando/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Continue as Guest/i })).toHaveAttribute(
      'href',
      '/choose-product?mode=guest',
    );
  });
});
