import { describe, it, expect, vi } from 'vitest';
import { redirect } from 'next/navigation';
import DownloadBrochurePage from '@/app/(site)/download-brochure/page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('app/(site)/download-brochure/page.tsx', () => {
  it('redirects to the downloads page', () => {
    DownloadBrochurePage();
    expect(redirect).toHaveBeenCalledWith('/downloads');
  });
});
