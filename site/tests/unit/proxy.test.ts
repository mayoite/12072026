import { describe, it, expect, vi } from 'vitest';

vi.mock('next/server', () => {
  class StubHeaders {
    private map = new Map<string, string>();
    set(k: string, v: string) { this.map.set(k.toLowerCase(), v); }
    get(k: string) { return this.map.get(k.toLowerCase()) || null; }
    has(k: string) { return this.map.has(k.toLowerCase()); }
  }

  const mockNextResponse = {
    next: vi.fn(() => ({ status: 200, headers: new StubHeaders() })),
    redirect: vi.fn((url: string | URL) => {
      const h = new StubHeaders();
      h.set('location', url.toString());
      return { status: 307, headers: h };
    }),
    json: vi.fn((data: unknown, options?: { status?: number }) => ({ status: options?.status || 200, headers: new StubHeaders() }))
  };

  return {
    NextRequest: class NextRequest {
      nextUrl: { pathname: string; search: string; clone: () => URL };
      method: string;
      headers: StubHeaders;
      cookies: { has: (n: string) => boolean; getAll: () => { name: string; value: string }[]; set: (n: string, v: string) => void };
      
      constructor(url: string, init?: { method?: string; headers?: Map<string, string> | Record<string, string> }) {
        const parsed = new URL(url);
        this.nextUrl = {
          pathname: parsed.pathname,
          search: parsed.search,
          clone: () => new URL(url)
        };
        this.method = init?.method || 'GET';
        this.headers = new StubHeaders();
        if (init?.headers) {
          if (init.headers instanceof Map) {
            init.headers.forEach((v: string, k: string) => this.headers.set(k, v));
          } else {
            Object.entries(init.headers as Record<string, string>).forEach(([k, v]) => this.headers.set(k, v));
          }
        }
        const cookiesMap = new Map<string, string>();
        this.cookies = {
          has: (name: string) => cookiesMap.has(name),
          getAll: () => Array.from(cookiesMap.entries()).map(([n, v]) => ({ name: n, value: v })),
          set: (name: string, value: string) => cookiesMap.set(name, value)
        };
      }
    },
    NextResponse: mockNextResponse
  };
});

vi.mock('next-intl/middleware', () => {
  return {
    default: () => () => undefined
  };
});

import { isPlannerGuestAllowedPath, isPublicPortalSvgCatalogPath, isPublicPortalGuestPath, isProtectedPath, hasSessionAuthCookies, proxy, buildContentSecurityPolicy, isCanvasHeavyPath } from '../../proxy';
import { NextRequest } from 'next/server';
import { PLANNER_GUEST_COOKIE } from '../../lib/auth/constants';

describe('proxy.ts', () => {
  describe('isPlannerGuestAllowedPath', () => {
    it('should allow /planner/guest', () => {
      expect(isPlannerGuestAllowedPath('/planner/guest')).toBe(true);
    });

    it('should allow /planner/canvas', () => {
      expect(isPlannerGuestAllowedPath('/planner/canvas')).toBe(true);
    });

    it('should allow /planner', () => {
      expect(isPlannerGuestAllowedPath('/planner')).toBe(true);
    });

    it('should not allow /other', () => {
      expect(isPlannerGuestAllowedPath('/other')).toBe(false);
    });
  });

  describe('isProtectedPath', () => {
    it('should return true for /dashboard', () => {
      expect(isProtectedPath('/dashboard')).toBe(true);
    });

    it('should return true for /portal/123', () => {
      expect(isProtectedPath('/portal/123')).toBe(true);
    });

    it('should return false for public Phase 05 /portal/svg-catalog index', () => {
      expect(isPublicPortalSvgCatalogPath('/portal/svg-catalog')).toBe(true);
      expect(isProtectedPath('/portal/svg-catalog')).toBe(false);
    });

    it('should return false for public Phase 05 /portal/svg-catalog/[slug]', () => {
      expect(isPublicPortalSvgCatalogPath('/portal/svg-catalog/side-table-001')).toBe(true);
      expect(isProtectedPath('/portal/svg-catalog/side-table-001')).toBe(false);
    });

    it('should return false for public guest portal entry', () => {
      expect(isPublicPortalGuestPath('/portal/guest')).toBe(true);
      expect(isPublicPortalGuestPath('/portal/guest/view/abc')).toBe(true);
      expect(isProtectedPath('/portal/guest')).toBe(false);
      expect(isProtectedPath('/portal/guest/')).toBe(false);
      expect(isProtectedPath('/portal/guest/view/abc')).toBe(false);
    });

    it('should still protect member portal routes', () => {
      expect(isProtectedPath('/portal')).toBe(true);
      expect(isProtectedPath('/portal/123')).toBe(true);
    });

    it('should return true for /admin', () => {
      expect(isProtectedPath('/admin')).toBe(true);
    });

    it('should return true for /crm', () => {
      expect(isProtectedPath('/crm')).toBe(true);
    });

    it('should return true for /ops', () => {
      expect(isProtectedPath('/ops')).toBe(true);
    });

    it('should return false for /public', () => {
      expect(isProtectedPath('/public')).toBe(false);
    });
  });

  describe('buildContentSecurityPolicy', () => {
    it('omits unsafe-eval on marketing paths', () => {
      expect(buildContentSecurityPolicy('/contact')).not.toContain("'unsafe-eval'");
    });

    it('allows unsafe-eval on marketing paths in development (React Refresh)', () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      try {
        expect(buildContentSecurityPolicy('/contact')).toContain("'unsafe-eval'");
      } finally {
        process.env.NODE_ENV = prev;
      }
    });

    it('allows unsafe-eval only on canvas-heavy paths', () => {
      expect(isCanvasHeavyPath('/planner/guest')).toBe(true);
      expect(buildContentSecurityPolicy('/planner/guest')).toContain("'unsafe-eval'");
    });

    it('allows Vercel Analytics and Speed Insights (dev scripts on va.vercel-scripts.com)', () => {
      const csp = buildContentSecurityPolicy('/contact');
      expect(csp).toContain('https://va.vercel-scripts.com');
      expect(csp).toContain('https://vitals.vercel-insights.com');
    });
  });

  describe('proxy', () => {
    it('should return a response with security headers for public paths', async () => {
      const request = new NextRequest('http://localhost/public', {
        headers: new Map([['user-agent', 'test']])
      });
      const response = await proxy(request as unknown as NextRequest);
      expect(response).toBeDefined();
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
      expect(response.headers.get('Content-Security-Policy')).not.toContain("'unsafe-eval'");
    });

    it('should redirect unauthenticated users from protected paths', async () => {
      const request = new NextRequest('http://localhost/dashboard');
      const response = await proxy(request as unknown as NextRequest);
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain('/access');
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
      expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'self'");
    });

    it('should allow unauthenticated users on public /portal/svg-catalog (Phase 05)', async () => {
      const request = new NextRequest('http://localhost/portal/svg-catalog');
      const response = await proxy(request as unknown as NextRequest);
      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    });

    it('should allow unauthenticated users on public /portal/guest', async () => {
      const request = new NextRequest('http://localhost/portal/guest');
      const response = await proxy(request as unknown as NextRequest);
      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    });

    it('should allow protected paths when Supabase auth cookies are present', async () => {
      const request = new NextRequest('http://localhost/admin/');
      // @ts-expect-error test mock
      request.cookies.set('sb-erpweaiypimorcunaimz-auth-token', 'session');
      const response = await proxy(request as unknown as NextRequest);
      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    });

    it('detects Supabase and legacy Appwrite session cookies', () => {
      expect(
        hasSessionAuthCookies([{ name: 'sb-project-auth-token', value: 'x' }]),
      ).toBe(true);
      expect(
        hasSessionAuthCookies([{ name: 'a_session_legacy', value: 'x' }]),
      ).toBe(true);
      expect(
        hasSessionAuthCookies([{ name: 'planner_guest', value: 'x' }]),
      ).toBe(false);
    });

    it('should allow unauthenticated users with planner guest cookie to access guest paths', async () => {
      const request = new NextRequest('http://localhost/planner/guest');
      // @ts-expect-error test mock
      request.cookies.set(PLANNER_GUEST_COOKIE, 'true');
      const response = await proxy(request as unknown as NextRequest);
      expect(response.status).toBe(200);
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    });
    
    it('should block guest users from performing mutations', async () => {
      const request = new NextRequest('http://localhost/planner/guest', {
        method: 'POST',
        headers: new Map([['next-action', 'some-action']])
      });
      // @ts-expect-error test mock
      request.cookies.set(PLANNER_GUEST_COOKIE, 'true');
      const response = await proxy(request as unknown as NextRequest);
      expect(response.status).toBe(403);
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    });
  });
});
