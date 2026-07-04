import { describe, it, expect, vi } from 'vitest';
import { redirect } from 'next/navigation';
import CatalogPage from '@/app/(site)/catalog/page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('app/(site)/catalog/page.tsx', () => {
  it('redirects to the downloads page', () => {
    CatalogPage();
    expect(redirect).toHaveBeenCalledWith('/downloads');
  });
});
