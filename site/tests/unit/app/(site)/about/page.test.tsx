import '@/tests/helpers/nextIntlServerEnMock';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '@/app/(site)/about/page';

vi.mock('@/components/home/Hero', () => ({
  Hero: () => <div data-testid="Hero" />
}));
vi.mock('@/components/shared/ContactTeaser', () => ({
  ContactTeaser: () => <div data-testid="ContactTeaser" />
}));
vi.mock('@/components/ClientBadge', () => ({
  ClientBadge: () => <div data-testid="ClientBadge" />
}));
vi.mock('@/components/home/HomeFAQ', () => ({
  HomeFAQ: () => <div data-testid="HomeFAQ" />
}));
vi.mock('@/components/shared/RouteCtaBand', () => ({
  RouteCtaBand: () => <div data-testid="RouteCtaBand" />
}));

describe('app/(site)/about/page.tsx', () => {
  it('renders successfully', async () => {
    const jsx = await Page();
    const { container } = render(jsx);
    expect(screen.getByTestId('Hero')).toBeInTheDocument();
    expect(screen.getByTestId('home-marketing-layout')).toBeInTheDocument();
    expect(screen.getByTestId('ContactTeaser')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="home-section"]')).toBeTruthy();
  });
});
