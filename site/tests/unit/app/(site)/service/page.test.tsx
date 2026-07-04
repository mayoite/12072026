import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServicePage, { metadata } from '@/app/(site)/service/page';

// Mock components
vi.mock('@/components/home/Hero', () => ({
  Hero: ({ title, subtitle }: any) => (
    <div data-testid="mock-hero">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </div>
  ),
}));

vi.mock('@/components/shared/ContactTeaser', () => ({
  ContactTeaser: () => <div data-testid="mock-contact-teaser">Contact Teaser</div>,
}));

vi.mock('@/components/shared/RouteCtaBand', () => ({
  RouteCtaBand: ({ kicker, title }: any) => (
    <div data-testid="mock-cta-band">
      <h3>{kicker}</h3>
      <h4>{title}</h4>
    </div>
  ),
}));

vi.mock('@/components/shared/SectionIntro', () => ({
  SectionIntro: ({ kicker, title }: any) => (
    <div data-testid="mock-section-intro">
      <span>{kicker}</span>
      <span>{title}</span>
    </div>
  ),
}));

vi.mock('@/components/ui/TrackedLink', () => ({
  TrackedLink: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

// Mock metadata & copies
vi.mock('@/lib/site-data/routeMetadata', () => ({
  SERVICE_PAGE_METADATA: { title: 'Service & Support' },
}));

vi.mock('@/lib/site-data/contact', () => ({
  SITE_CONTACT: {
    supportPhone: '+91 99999 99999',
    salesEmail: 'sales@oando.local',
  },
}));

vi.mock('@/lib/site-data/routeCopy', () => ({
  SERVICE_PAGE_COPY: {
    heroTitle: 'Service and Support',
    heroSubtitle: 'Help center',
    frameworkKicker: 'Framework',
    frameworkTitle: 'Our Framework',
    channelsKicker: 'Get in touch',
    channelsTitle: 'Support Channels',
    supportKicker: 'Need direct help?',
    supportDescription: 'Submit an online request.',
    primaryCta: 'Contact support',
    secondaryCta: 'Track order',
    tertiaryCta: 'Resources',
    supportDeskKicker: 'Desk help',
    supportDeskTitle: 'Support Desk',
    supportDeskDescription: 'Check it out',
  },
  SERVICE_PAGE_PILLARS: [
    { title: 'Quality Assurance', detail: 'We verify everything.' },
  ],
  SERVICE_PAGE_CHANNELS: [
    { kind: 'supportPhone', label: 'Call us' },
    { kind: 'salesEmail', label: 'Email sales' },
    { kind: 'other', label: 'WhatsApp', href: 'https://wa.me', value: 'WhatsApp chat' },
  ],
}));

describe('ServicePage Component', () => {
  it('renders all components and channels correctly', () => {
    expect(metadata).toEqual({ title: 'Service & Support' });

    render(<ServicePage />);

    expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
    expect(screen.getByText('Quality Assurance')).toBeInTheDocument();
    expect(screen.getByText('We verify everything.')).toBeInTheDocument();

    expect(screen.getByText('+91 99999 99999')).toBeInTheDocument();
    expect(screen.getByText('sales@oando.local')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp chat')).toBeInTheDocument();

    expect(screen.getByTestId('mock-cta-band')).toBeInTheDocument();
    expect(screen.getByTestId('mock-contact-teaser')).toBeInTheDocument();
  });
});
