import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RepoStorePageView } from '@/components/repo-store/RepoStorePageView';

// Mock css styles import if needed, although vitest handles modules.
// Just in case, we don't mock it unless necessary, but let's mock it to be safe and clean.
vi.mock('./RepoStorePageView.module.css', () => ({
  default: {
    page: 'page-class',
    shell: 'shell-class',
    rail: 'rail-class',
    logo: 'logo-class',
    pathBox: 'pathbox-class',
    content: 'content-class',
    topbar: 'topbar-class',
    primaryLink: 'primarylink-class',
    metrics: 'metrics-class',
    panel: 'panel-class',
    panelHead: 'panelhead-class',
    auditTable: 'audittable-class',
    auditAction: 'auditaction-class',
    planLink: 'planlink-class',
    planGrid: 'plangrid-class',
    inventoryGrid: 'inventorygrid-class',
    inventoryPaths: 'inventorypaths-class',
    workflow: 'workflow-class',
    grid: 'grid-class',
    domainRows: 'domainrows-class',
    blockers: 'blockers-class',
    nextPanel: 'nextpanel-class',
  },
}));

describe('RepoStorePageView Component', () => {
  it('renders all sections and metrics correctly', () => {
    render(<RepoStorePageView />);

    // Topbar header
    expect(screen.getByText('Repository command center')).toBeInTheDocument();
    expect(
      screen.getByText('Make the Oando app understandable, wired, and shippable.')
    ).toBeInTheDocument();

    // Navigation aside
    expect(screen.getByRole('complementary', { name: /Repo store navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'OANDO' })).toHaveAttribute('href', '/');

    // Metrics check
    expect(screen.getByText('deterministic tests pass')).toBeInTheDocument();
    expect(screen.getByText('31/31')).toBeInTheDocument();

    // Audit check
    expect(screen.getByRole('heading', { name: 'Repository Audit', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Planner persistence')).toBeInTheDocument();

    // Consolidation plan check
    expect(screen.getByRole('heading', { name: 'Consolidation Plan', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Baseline and dependency audit')).toBeInTheDocument();

    // inventory check
    expect(screen.getByRole('heading', { name: 'Complete File Inventory', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('active paths')).toBeInTheDocument();
    expect(screen.getByText('4,144')).toBeInTheDocument();

    // blockers check
    expect(screen.getByRole('heading', { name: 'Release Blockers', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Typecheck')).toBeInTheDocument();

    // link check
    expect(screen.getByRole('link', { name: 'Open planner' })).toHaveAttribute('href', '/planner');
  });
});
