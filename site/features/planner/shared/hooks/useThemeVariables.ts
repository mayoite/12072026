'use client';

import { useMemo } from 'react';

/**
 * Extracts computed CSS variables from the document root.
 * This is critical for HTML5 Canvas engines (Konva) which cannot natively parse
 * `var(--color-block-wall)` in their fill/stroke properties.
 */
export function useThemeVariables() {
  // Use a simple memo to avoid re-extracting unless necessary.
  // Note: Since this reads from document.documentElement, it must only run on the client.
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        blockWall: 'var(--text-body)',
        blockWallHover: 'var(--text-heading-soft)',
        blockWallActive: '#f59e0b',
        blockDesk: 'var(--text-muted)',
        blockDeskHover: 'var(--text-subtle)',
        blockDeskActive: '#f59e0b',
        blockChair: 'var(--text-inverse-subtle)',
        blockChairHover: 'var(--text-inverse-muted)',
        blockChairActive: '#f59e0b',
        canvasBg: 'var(--color-dark-midnight-blue-750)',
        canvasGrid: 'var(--text-body)',
      };
    }

    const computed = window.getComputedStyle(document.documentElement);
    
    // Helper to safely extract and fallback
    const getVar = (name: string, fallback: string) => {
      const val = computed.getPropertyValue(name).trim();
      return val ? val : fallback;
    };

    return {
      blockWall: getVar('--color-block-wall', 'var(--color-dark-midnight-blue-700)'),
      blockWallHover: getVar('--color-block-wall-hover', 'var(--color-dark-midnight-blue-650)'),
      blockWallActive: getVar('--color-block-wall-active', 'var(--color-bronze-400)'),
      blockDesk: getVar('--color-block-desk', 'var(--color-dark-midnight-blue-600)'),
      blockDeskHover: getVar('--color-block-desk-hover', 'var(--color-dark-midnight-blue-550)'),
      blockDeskActive: getVar('--color-block-desk-active', 'var(--color-bronze-400)'),
      blockChair: getVar('--color-block-chair', 'var(--color-dark-midnight-blue-400)'),
      blockChairHover: getVar('--color-block-chair-hover', 'var(--color-dark-midnight-blue-350)'),
      blockChairActive: getVar('--color-block-chair-active', 'var(--color-bronze-400)'),
      canvasBg: getVar('--color-canvas-bg', '#f4f4f0'),
      canvasGrid: getVar('--color-canvas-grid', '#c4c4bc'),
    };
  }, []);
}
