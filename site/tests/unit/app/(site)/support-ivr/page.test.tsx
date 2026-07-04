import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SupportPage, { metadata } from '@/app/(site)/support-ivr/page';

vi.mock('@/components/support/SupportIvrPageView', () => ({
  SupportIvrPageView: () => <div data-testid="support-ivr-page-view">Support IVR Page View</div>,
}));

vi.mock('@/lib/site-data/routeMetadata', () => ({
  SUPPORT_IVR_PAGE_METADATA: { title: 'Support IVR Title' },
}));

describe('SupportPage Route (support-ivr)', () => {
  it('renders SupportIvrPageView component', () => {
    expect(metadata).toEqual({ title: 'Support IVR Title' });
    render(<SupportPage />);
    expect(screen.getByTestId('support-ivr-page-view')).toBeInTheDocument();
  });
});
