import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '@/app/(site)/planning/page';

vi.mock('@/components/home/Hero', () => ({
  Hero: () => <div data-testid="Hero" />
}));
vi.mock('@/components/shared/ContactTeaser', () => ({
  ContactTeaser: () => <div data-testid="ContactTeaser" />
}));
vi.mock('@/components/shared/RouteCtaBand', () => ({
  RouteCtaBand: () => <div data-testid="RouteCtaBand" />
}));
vi.mock('@/components/shared/SectionIntro', () => ({
  SectionIntro: ({ title }: { title: string }) => <div data-testid="SectionIntro">{title}</div>
}));
vi.mock('@/components/ui/TrackedLink', () => ({
  TrackedLink: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('app/(site)/planning/page.tsx', () => {
  it('renders successfully', () => {
    render(<Page />);
    expect(screen.getByTestId('Hero')).toBeInTheDocument();
    expect(screen.getByTestId('ContactTeaser')).toBeInTheDocument();
  });
});
