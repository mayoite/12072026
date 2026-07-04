import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { CsrfBootstrap } from '@/components/security/CsrfBootstrap';
import { ensureCsrfToken } from '@/lib/api/browserApi';

vi.mock('@/lib/api/browserApi', () => ({
  ensureCsrfToken: vi.fn(),
}));

describe('CsrfBootstrap Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls ensureCsrfToken on mount', () => {
    (ensureCsrfToken as any).mockResolvedValue(undefined);

    const { container } = render(<CsrfBootstrap />);
    
    expect(ensureCsrfToken).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toBeNull();
  });

  it('safely handles error from ensureCsrfToken', async () => {
    (ensureCsrfToken as any).mockRejectedValue(new Error('Network Error'));

    const { container } = render(<CsrfBootstrap />);

    expect(ensureCsrfToken).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toBeNull();
  });
});
