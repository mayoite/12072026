import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MobileNavDrawer } from '@/components/site/MobileNavDrawer';

// Mock phosphor icons
vi.mock('@phosphor-icons/react', () => ({
  CaretDown: () => <span data-testid="caret-icon" />,
  MagnifyingGlass: () => <span data-testid="magnifier-icon" />,
  Sparkle: () => <span data-testid="sparkle-icon" />,
  X: () => <span data-testid="close-icon" />,
}));

// Mock Logo
vi.mock('@/components/ui/Logo', () => ({
  OneAndOnlyLogo: () => <div data-testid="drawer-logo" />,
}));

// Mock vaul Drawer
vi.mock('vaul', () => ({
  Drawer: {
    Root: ({ children, open }: any) => (
      <div data-testid="drawer-root" data-open={open}>
        {children}
      </div>
    ),
    Portal: ({ children }: any) => <div data-testid="drawer-portal">{children}</div>,
    Overlay: ({ className }: any) => <div data-testid="drawer-overlay" className={className} />,
    Content: React.forwardRef(({ children, className, onOpenAutoFocus: _onOpenAutoFocus, onCloseAutoFocus: _onCloseAutoFocus, ...props }: any, ref: any) => (
      <div ref={ref} className={className} data-testid="drawer-content" {...props}>
        {children}
      </div>
    )),
  },
}));

// Mock site data & analytics
vi.mock('@/lib/siteNav', () => ({
  SITE_NAV_LINKS: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products', hasMega: true },
  ],
  SITE_CTA_LINKS: [
    { label: 'Quote Cart', href: '/quote-cart', variant: 'primary' },
  ],
}));

vi.mock('@/lib/analytics/siteEvents', () => ({
  trackSiteSearchSubmitted: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('MobileNavDrawer Component', () => {
  let mockFetch: any;
  const closeButtonRef = React.createRef<HTMLButtonElement>();

  beforeEach(() => {
    vi.clearAllMocks();

    mockFetch = vi.fn((url: string) => {
      if (url.includes('/api/nav-search/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            results: [{ id: 'r1', title: 'Task Office Chair', href: '/products/chairs/task', type: 'product', source: 'local' }],
          }),
        });
      }
      return Promise.reject(new Error('Unknown Endpoint'));
    });
    global.fetch = mockFetch;
  });

  const categories = [
    {
      groupId: 'seating',
      groupLabel: 'Seating',
      items: [
        {
          id: 'chairs',
          name: 'Chairs',
          href: '/products/chairs',
          subcategories: [
            { id: 'task-chairs', name: 'Task Chairs', href: '/products/chairs/task' },
          ],
        },
      ],
    },
  ];

  it('keeps drawer root mounted but closed when open is false', async () => {
    render(
      <MobileNavDrawer
        open={false}
        onClose={vi.fn()}
        closeButtonRef={closeButtonRef}
        groupedCategories={categories}
      />
    );
    await act(async () => {});
    expect(screen.getByTestId('drawer-root')).toHaveAttribute('data-open', 'false');
  });

  it('renders drawer layout, logo, and nav links when open is true', async () => {
    render(
      <MobileNavDrawer
        open={true}
        onClose={vi.fn()}
        closeButtonRef={closeButtonRef}
        groupedCategories={categories}
      />
    );
    await act(async () => {});

    expect(screen.getByTestId('drawer-logo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('button', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Quote Cart' })).toHaveAttribute('href', '/quote-cart');
  });

  it('locks body overflow on mount and restores on unmount/close', () => {
    const { unmount } = render(
      <MobileNavDrawer
        open={true}
        onClose={vi.fn()}
        closeButtonRef={closeButtonRef}
        groupedCategories={categories}
      />
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('toggles product categories accordion on click', async () => {
    render(
      <MobileNavDrawer
        open={true}
        onClose={vi.fn()}
        closeButtonRef={closeButtonRef}
        groupedCategories={categories}
      />
    );
    await act(async () => {});

    const accordionBtn = screen.getByRole('button', { name: 'Products' });
    expect(screen.queryByText('Seating')).toBeNull();

    // Click to open
    fireEvent.click(accordionBtn);
    expect(screen.getByText('Seating')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Task Chairs' })).toHaveAttribute('href', '/products/chairs/task');

    // Click to close
    fireEvent.click(accordionBtn);
    expect(screen.queryByText('Seating')).toBeNull();
  });

  it('performs debounced search and resolves queries', async () => {
    const onCloseMock = vi.fn();
    render(
      <MobileNavDrawer
        open={true}
        onClose={onCloseMock}
        closeButtonRef={closeButtonRef}
        groupedCategories={categories}
      />
    );

    const searchInput = screen.getByPlaceholderText('AI search products...');
    fireEvent.change(searchInput, { target: { value: 'Task' } });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/nav-search/', expect.any(Object));
    });

    await waitFor(() => {
      expect(screen.getByText('Task Office Chair')).toBeInTheDocument();
    });

    // Click search result triggers navigation and closes drawer
    fireEvent.click(screen.getByText('Task Office Chair'));
    expect(onCloseMock).toHaveBeenCalled();
    await act(async () => {});
  });

  it('escapes / closes on Escape keydown', async () => {
    const onCloseMock = vi.fn();
    render(
      <MobileNavDrawer
        open={true}
        onClose={onCloseMock}
        closeButtonRef={closeButtonRef}
        groupedCategories={categories}
      />
    );
    await act(async () => {});

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onCloseMock).toHaveBeenCalled();
  });
});
