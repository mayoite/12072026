import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CookieConsentBar } from '@/components/site/CookieConsentBar';

const flushAnalyticsAfterConsent = vi.fn();

vi.mock('@/lib/analytics/siteEvents', () => ({
  flushAnalyticsAfterConsent: () => flushAnalyticsAfterConsent(),
}));

describe('CookieConsentBar Component', () => {
  let mockCookieStore: Record<string, string> = {};
  const originalCookie = Object.getOwnPropertyDescriptor(document, 'cookie');

  beforeEach(() => {
    vi.useFakeTimers();
    mockCookieStore = {};
    flushAnalyticsAfterConsent.mockClear();

    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      get: () =>
        Object.entries(mockCookieStore)
          .map(([k, v]) => `${k}=${v}`)
          .join('; '),
      set: (val: string) => {
        const parts = val.split(';');
        const [k, v] = parts[0].split('=');
        // Handle cookie deletion via Max-Age=0
        if (parts.some((p) => p.trim() === 'Max-Age=0')) {
          delete mockCookieStore[k.trim()];
        } else {
          mockCookieStore[k.trim()] = v.trim();
        }
      },
      configurable: true,
    });

    // Mock document properties
    Object.defineProperty(document, 'referrer', {
      value: 'https://www.google.com',
      configurable: true,
    });

    document.documentElement.lang = 'en-US';
  });

  afterEach(() => {
    vi.useRealTimers();
    if (originalCookie) {
      Object.defineProperty(document, 'cookie', originalCookie);
    }
  });

  it('renders dialog when no consent cookie is present', () => {
    render(<CookieConsentBar />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/We use essential cookies/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Accept All/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reject Non-Essential/i })).toBeInTheDocument();
  });

  it('does not render dialog if consent cookie is already set to accepted', () => {
    mockCookieStore['oando_cookie_consent'] = 'accepted';

    const { container } = render(<CookieConsentBar />);
    expect(container.firstChild).toBeNull();
  });

  it('auto-accepts cookies after 5 seconds if not interacted with', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    render(<CookieConsentBar />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(mockCookieStore['oando_cookie_consent']).toBe('accepted');
    expect(mockCookieStore['oando_seo_source']).toBe('google');
    expect(mockCookieStore['oando_seo_locale']).toBe('en-US');

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'oando-cookie-consent',
        detail: { value: 'accepted' },
      })
    );

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('sets cookies, dispatches event and hides on clicking Accept All', async () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    render(<CookieConsentBar />);

    const acceptBtn = screen.getByRole('button', { name: /Accept All/i });
    fireEvent.click(acceptBtn);

    expect(mockCookieStore['oando_cookie_consent']).toBe('accepted');
    expect(mockCookieStore['oando_seo_source']).toBe('google');

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'oando-cookie-consent',
        detail: { value: 'accepted' },
      })
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(flushAnalyticsAfterConsent).toHaveBeenCalled();

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('sets rejected cookie, clears other cookies, dispatches event and hides on clicking Reject Non-Essential', () => {
    // Put some pre-existing SEO cookies
    mockCookieStore['oando_seo_source'] = 'google';
    mockCookieStore['oando_seo_locale'] = 'en-US';

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    render(<CookieConsentBar />);

    const rejectBtn = screen.getByRole('button', { name: /Reject Non-Essential/i });
    fireEvent.click(rejectBtn);

    expect(mockCookieStore['oando_cookie_consent']).toBe('rejected');
    // SEO cookies should be cleared (Max-Age=0 calls clear)
    expect(mockCookieStore['oando_seo_source']).toBeUndefined();
    expect(mockCookieStore['oando_seo_locale']).toBeUndefined();

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'oando-cookie-consent',
        detail: { value: 'rejected' },
      })
    );

    expect(flushAnalyticsAfterConsent).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('flushes queued analytics after timed auto-accept', async () => {
    render(<CookieConsentBar />);

    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    expect(mockCookieStore['oando_cookie_consent']).toBe('accepted');
    expect(flushAnalyticsAfterConsent).toHaveBeenCalled();
  });
});
