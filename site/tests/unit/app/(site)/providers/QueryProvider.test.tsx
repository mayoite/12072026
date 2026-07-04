import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import QueryProvider from '@/app/(site)/providers/QueryProvider';

describe('QueryProvider', () => {
  it('renders QueryClientProvider wrapping children', () => {
    render(
      <QueryProvider>
        <span data-testid="inner-child">Content</span>
      </QueryProvider>
    );

    expect(screen.getByTestId('inner-child')).toBeInTheDocument();
  });
});
