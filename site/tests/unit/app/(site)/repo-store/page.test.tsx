import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RepoStorePage, { metadata } from '@/app/(site)/repo-store/page';

vi.mock('@/components/repo-store/RepoStorePageView', () => ({
  RepoStorePageView: () => <div data-testid="mock-repo-view">Repo Store View</div>,
}));

vi.mock('@/lib/site-data/seo', () => ({
  buildPageMetadata: (_base: string, opts: any) => ({
    title: opts.title,
    description: opts.description,
  }),
}));

vi.mock('@/lib/siteUrl', () => ({
  SITE_URL: 'http://localhost:3000',
}));

describe('RepoStorePage Component', () => {
  it('renders RepoStorePageView component', () => {
    expect(metadata.title).toBe('Repo Store');
    render(<RepoStorePage />);
    expect(screen.getByTestId('mock-repo-view')).toBeInTheDocument();
  });
});
