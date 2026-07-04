import { describe, it, expect, vi, afterEach } from 'vitest';
import { CONSENT_COOKIE, hasConsentChoice } from '../../../lib/consent';

describe('consent', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return false when document is undefined', () => {
    vi.stubGlobal('document', undefined);
    expect(hasConsentChoice()).toBe(false);
  });

  it('should return false when consent cookie is not present', () => {
    const mockDocument = {
      cookie: 'other_cookie=value; another=123',
    };
    vi.stubGlobal('document', mockDocument);
    expect(hasConsentChoice()).toBe(false);
  });

  it('should return true when consent cookie is present', () => {
    const mockDocument = {
      cookie: `other_cookie=value; ${CONSENT_COOKIE}=accepted; another=123`,
    };
    vi.stubGlobal('document', mockDocument);
    expect(hasConsentChoice()).toBe(true);
  });
});
