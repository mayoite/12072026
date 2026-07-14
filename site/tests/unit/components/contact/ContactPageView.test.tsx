import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContactPageView } from '@/components/contact/ContactPageView';
import enMessages from '@/i18n/messages/en.json';
import { SITE_CONTACT } from '@/features/site/data/contact';

vi.mock('next-intl/server', async () => {
  const messages = (await import('@/i18n/messages/en.json')).default;
  return {
    getTranslations: async (namespace: string) => {
      const ns = messages[namespace as keyof typeof messages] as Record<string, unknown>;
      const t = (key: string) => {
        const val = ns[key];
        return typeof val === 'string' ? val : key;
      };
      t.raw = (key: string) => ns[key] ?? [];
      t.rich = t;
      return t;
    },
  };
});

vi.mock('@/components/home/Hero', () => ({
  Hero: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div data-testid="mock-hero">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  )
}));

vi.mock('@/components/contact/CustomerQueryForm', () => ({
  CustomerQueryForm: ({ intent, source }: { intent: string | null; source: string | null }) => (
    <div data-testid="mock-query-form">
      <span>Intent: {intent || 'none'}</span>
      <span>Source: {source || 'none'}</span>
    </div>
  )
}));

vi.mock('@phosphor-icons/react', () => ({
  MapPin: () => <span data-testid="mappin-icon" />,
  Phone: () => <span data-testid="phone-icon" />,
  Mail: () => <span data-testid="mail-icon" />
}));

vi.mock('@/features/site/data/seo', () => ({
  buildPageJsonLd: vi.fn().mockReturnValue({ '@context': 'https://schema.org', '@type': 'ContactPage' })
}));

const contact = enMessages.contact;

describe('ContactPageView Component', () => {
  it('renders JSON-LD schema script and child components', async () => {
    const jsx = await ContactPageView({ intent: 'quote', source: 'google' });
    const { container } = render(jsx);

    expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
    expect(screen.getByText(contact.heroTitle)).toBeInTheDocument();

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    expect(script?.textContent).toContain('ContactPage');

    contact.offices.forEach((office) => {
      expect(screen.getByText(office.title)).toBeInTheDocument();
      office.lines.forEach((line) => {
        expect(screen.getAllByText(line).length).toBeGreaterThan(0);
      });
    });

    expect(screen.getByText(SITE_CONTACT.regionLine)).toBeInTheDocument();
    expect(screen.getByText(SITE_CONTACT.salesPhone)).toBeInTheDocument();
    expect(screen.getByText(SITE_CONTACT.supportPhone)).toBeInTheDocument();
    expect(screen.getByText(SITE_CONTACT.salesEmail)).toBeInTheDocument();

    expect(screen.getByTestId('mock-query-form')).toBeInTheDocument();
    expect(screen.getByText('Intent: quote')).toBeInTheDocument();
    expect(screen.getByText('Source: google')).toBeInTheDocument();
  });
});
