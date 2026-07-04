import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '@/app/(site)/career/page';

vi.mock('@/components/career/CareerPageView', () => ({
  CareerPageView: () => <div data-testid="CareerPageView" />
}));

describe('app/(site)/career/page.tsx', () => {
  it('renders successfully', () => {
    render(<Page />);
    expect(screen.getByTestId('CareerPageView')).toBeInTheDocument();
  });
});
