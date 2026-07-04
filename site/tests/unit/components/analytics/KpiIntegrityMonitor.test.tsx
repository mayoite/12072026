import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { KpiIntegrityMonitor } from '@/components/analytics/KpiIntegrityMonitor';
import { trackKpiFallbackUsed, trackKpiRendered } from '@/lib/analytics/kpiEvents';
import { runKpiCanonicalIntegrityCheck } from '@/lib/analytics/kpiIntegrity';

vi.mock('@/lib/analytics/kpiEvents', () => ({
  trackKpiFallbackUsed: vi.fn(),
  trackKpiRendered: vi.fn()
}));

vi.mock('@/lib/analytics/kpiIntegrity', () => ({
  runKpiCanonicalIntegrityCheck: vi.fn()
}));

describe('KpiIntegrityMonitor Component', () => {
  const stats = {
    asOfDate: '2026-06-26',
    kpis: [],
    experienceYears: 10,
    satisfiedClientsCount: 5000,
    countriesCovered: 12
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing and tracks KPI rendering', () => {
    const { container } = render(
      <KpiIntegrityMonitor page="home" source="supabase" stats={stats} />
    );
    expect(container.firstChild).toBeNull();
    expect(trackKpiRendered).toHaveBeenCalledWith({ asOfDate: '2026-06-26', source: 'supabase' });
    expect(trackKpiFallbackUsed).not.toHaveBeenCalled();
  });

  it('tracks KPI fallback used if source is not supabase', () => {
    render(<KpiIntegrityMonitor page="home" source="local" stats={stats} />);
    expect(trackKpiFallbackUsed).toHaveBeenCalledWith({ source: 'local' });
  });

  it('runs integrity check after a 400ms delay', () => {
    render(<KpiIntegrityMonitor page="home" source="supabase" stats={stats} />);
    
    expect(runKpiCanonicalIntegrityCheck).not.toHaveBeenCalled();

    // Fast-forward 400ms
    vi.advanceTimersByTime(400);

    expect(runKpiCanonicalIntegrityCheck).toHaveBeenCalledWith(
      'home',
      stats,
      expect.any(AbortSignal)
    );
  });

  it('cleans up timeout and aborts signal on unmount', () => {
    const { unmount } = render(
      <KpiIntegrityMonitor page="home" source="supabase" stats={stats} />
    );
    
    // Unmount before timer fires
    unmount();

    vi.advanceTimersByTime(400);
    expect(runKpiCanonicalIntegrityCheck).not.toHaveBeenCalled();
  });
});
