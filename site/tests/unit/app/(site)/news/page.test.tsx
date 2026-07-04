import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '@/app/(site)/news/page';

vi.mock('next-intl/server', async () => {
  const enMessages = (await import('@/i18n/messages/en.json')).default;
  return {
    getTranslations: async (namespace: string) => {
      const messages = enMessages[namespace as keyof typeof enMessages] as Record<string, unknown>;
      const t = (key: string) => {
        const val = messages[key];
        return typeof val === 'string' ? val : key;
      };
      t.raw = (key: string) => messages[key] ?? [];
      t.rich = t;
      return t;
    },
  };
});

vi.mock('@/components/home/Hero', () => ({
  Hero: () => <div data-testid="Hero" />
}));
vi.mock('@/components/shared/ContactTeaser', () => ({
  ContactTeaser: () => <div data-testid="ContactTeaser" />
}));

describe('app/(site)/news/page.tsx', () => {
  it('renders successfully', async () => {
    const jsx = await Page();
    render(jsx);
    expect(screen.getByTestId('Hero')).toBeInTheDocument();
    expect(screen.getByTestId('ContactTeaser')).toBeInTheDocument();
  });
});
