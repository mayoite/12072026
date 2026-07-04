import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '@/app/(site)/gallery/page';

vi.mock('@/components/home/Hero', () => ({
  Hero: () => <div data-testid="Hero" />
}));
vi.mock('@/components/shared/ContactTeaser', () => ({
  ContactTeaser: () => <div data-testid="ContactTeaser" />
}));
vi.mock('@/components/ui/Masonry', () => ({
  Masonry: ({ children }: { children: React.ReactNode }) => <div data-testid="Masonry">{children}</div>,
  MasonryItem: ({ children }: { children: React.ReactNode }) => <div data-testid="MasonryItem">{children}</div>
}));

describe('app/(site)/gallery/page.tsx', () => {
  it('renders successfully', () => {
    render(<Page />);
    expect(screen.getByTestId('Hero')).toBeInTheDocument();
    expect(screen.getByTestId('Masonry')).toBeInTheDocument();
    expect(screen.getByTestId('ContactTeaser')).toBeInTheDocument();
  });
});
