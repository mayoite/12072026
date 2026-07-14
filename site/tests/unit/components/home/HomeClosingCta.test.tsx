import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeClosingCta } from '@/components/home/HomeClosingCta';
import { HOMEPAGE_CLOSING_CTA_CONTENT } from '@/features/site/data/homepage';

vi.mock('@/components/shared/RouteCtaBand', () => ({
  RouteCtaBand: ({ kicker, title, description, actions }: any) => (
    <div data-testid="route-cta-band">
      <span>Kicker: {kicker}</span>
      <div>Title: {title}</div>
      <p>Description: {description}</p>
      <ul>
        {actions.map((act: any, idx: number) => (
          <li key={idx}>
            <a href={act.href}>{act.label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}));

vi.mock('@/features/site/data/contact', () => ({
  buildWhatsAppHref: (msg: string) => `https://wa.me/mock?text=${encodeURIComponent(msg)}`,
  toTelHref: (phone: string) => `tel:${phone}`,
  SITE_CONTACT: {
    supportPhone: '+919835630940'
  }
}));

describe('HomeClosingCta Component', () => {
  it('renders correctly with mocked RouteCtaBand details', () => {
    render(<HomeClosingCta />);

    expect(screen.getByTestId('route-cta-band')).toBeInTheDocument();
    expect(screen.getByText(`Kicker: ${HOMEPAGE_CLOSING_CTA_CONTENT.kicker}`)).toBeInTheDocument();

    const linkPrimary = screen.getByRole('link', { name: HOMEPAGE_CLOSING_CTA_CONTENT.actions.primary.label });
    expect(linkPrimary).toHaveAttribute('href', HOMEPAGE_CLOSING_CTA_CONTENT.actions.primary.href);

    const linkWa = screen.getByRole('link', { name: HOMEPAGE_CLOSING_CTA_CONTENT.actions.whatsapp.label });
    expect(linkWa).toHaveAttribute('href', expect.stringContaining('wa.me'));

    const linkPhone = screen.getByRole('link', { name: HOMEPAGE_CLOSING_CTA_CONTENT.actions.phone.label });
    expect(linkPhone).toHaveAttribute('href', 'tel:+919835630940');
  });
});
