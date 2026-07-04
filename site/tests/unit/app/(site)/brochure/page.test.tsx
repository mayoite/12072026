import { describe, it, expect, vi } from 'vitest';
import { redirect } from 'next/navigation';
import BrochurePage from '@/app/(site)/brochure/page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('app/(site)/brochure/page.tsx', () => {
  it('redirects to the downloads page', () => {
    BrochurePage();
    expect(redirect).toHaveBeenCalledWith('/downloads');
  });
});
