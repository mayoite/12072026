import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThreeViewer from '@/components/ThreeViewer';
import { useGLTF } from '@react-three/drei';
import { logClientError } from '@/lib/errorLogger';

// Mock fiber/drei
let renderCanvasChildren = false;

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: ReactNode }) => (
    <div data-testid="mock-canvas">
      {renderCanvasChildren ? children : null}
    </div>
  )
  ,
  useThree: () => ({
    gl: {
      setSize: vi.fn(),
    },
    camera: {
      aspect: 1,
      updateProjectionMatrix: vi.fn(),
    },
  }),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="mock-orbit-controls" />,
  useGLTF: vi.fn(),
  Environment: () => <div data-testid="mock-environment" />,
  ContactShadows: () => <div data-testid="mock-shadows" />
}));

vi.mock('@/lib/errorLogger', () => ({
  logClientError: vi.fn()
}));

describe('ThreeViewer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    renderCanvasChildren = false;
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      disconnect() {}
    });
  });

  it('returns fallback or null if modelUrl is not provided', () => {
    render(<ThreeViewer modelUrl="" fallback={<div data-testid="custom-fallback" />} />);
    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();

    const { container: emptyContainer } = render(<ThreeViewer modelUrl="" />);
    expect(emptyContainer.firstChild).toBeNull();
  });

  it('renders Canvas when modelUrl is provided', () => {
    vi.mocked(useGLTF).mockReturnValue({
      scene: {
        clone: () => 'mock-scene-cloned'
      }
    } as any);

    render(<ThreeViewer modelUrl="/models/chair.glb" />);

    expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
  });

  it('catches error in boundary and logs it', () => {
    renderCanvasChildren = true;
    vi.mocked(useGLTF).mockImplementation(() => {
      throw new Error('GLTF loading failed');
    });

    // Suppress console.error output from Vitest log during simulated crash
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<ThreeViewer modelUrl="/models/broken.glb" />);

    expect(screen.getByText('3D Preview unavailable')).toBeInTheDocument();
    expect(screen.getByText('An error occurred loading the 3D model.')).toBeInTheDocument();
    expect(logClientError).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('renders custom fallback in error boundary if provided', () => {
    renderCanvasChildren = true;
    vi.mocked(useGLTF).mockImplementation(() => {
      throw new Error('GLTF loading failed');
    });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<ThreeViewer modelUrl="/models/broken.glb" fallback={<div data-testid="custom-err-fallback" />} />);

    expect(screen.getByTestId('custom-err-fallback')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});
