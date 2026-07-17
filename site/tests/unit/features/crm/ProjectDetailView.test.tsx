import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import ProjectDetailView from '@/features/crm/ProjectDetailView';

const mockProjects = [
  {
    id: 'proj1',
    clientId: 'c1',
    name: 'Project Alpha',
    notes: 'Brief notes for Alpha',
    planIds: ['local1'],
    createdAt: '2026-06-25T00:00:00Z',
    updatedAt: '2026-06-26T00:00:00Z',
  },
];
const mockClients = [
  {
    id: 'c1',
    name: 'Client Acme',
    company: 'Acme Corp',
    email: 'acme@example.com',
    phone: '+12345678',
  },
];
const mockAssignPlan = vi.fn();
const mockRemovePlan = vi.fn();
const mockPush = vi.fn();

vi.mock('@/features/crm/stores/crmStore', () => ({
  useCrmStore: vi.fn(() => ({
    projects: mockProjects,
    clients: mockClients,
    assignPlanToProject: mockAssignPlan,
    removePlanFromProject: mockRemovePlan,
  })),
}));

vi.mock('@/features/planner/lib/projectIndex', () => ({
  getSavedPlans: vi.fn(() => [
    { id: 'local1', name: 'Local Blueprint 1', furniture: [{}, {}], savedAt: '2026-06-26T00:00:00Z' },
  ]),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/features/shared/shell/GlobalNavHeader', () => ({
  GlobalNavHeader: () => <div data-testid="mock-global-nav-header">Header</div>,
}));

describe('ProjectDetailView Component', () => {
  const originalFetch = global.fetch;
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
    localStorage.clear();
    // Silence console error logs for predictable behavior testing
    vi.spyOn(console, 'error').mockImplementation(() => {});

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        documents: [
          { id: 'online1', name: 'Online Blueprint 1', item_count: 5, updated_at: '2026-06-26T00:00:00Z' },
        ],
      }),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('renders "Project not found" when project is missing', () => {
    render(<ProjectDetailView projectId="non-existent" />);

    expect(screen.getByText('Project not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to Projects' })).toBeInTheDocument();
  });

  it('renders project detail header, metadata, client details, and associated plans', async () => {
    render(<ProjectDetailView projectId="proj1" />);

    // Assert fetch API details called
    expect(mockFetch).toHaveBeenCalledWith('/api/plans', { credentials: 'include' });

    // Header & Info
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Brief notes for Alpha')).toBeInTheDocument();

    // Client Card
    expect(screen.getByText('Client Acme')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('acme@example.com')).toBeInTheDocument();
    expect(screen.getByText('+12345678')).toBeInTheDocument();

    // Renders Local Blueprint 1 linked inside the project
    await waitFor(() => {
      expect(screen.getByText('Local Blueprint 1')).toBeInTheDocument();
    });
    expect(screen.getByText('local')).toBeInTheDocument();
    expect(screen.getByText('2 items')).toBeInTheDocument();
  });

  it('unlinks assigned plans when unlink button is clicked', async () => {
    render(<ProjectDetailView projectId="proj1" />);

    await waitFor(() => {
      expect(screen.getByText('Local Blueprint 1')).toBeInTheDocument();
    });

    const unlinkBtn = screen.getByTitle('Unlink plan');
    fireEvent.click(unlinkBtn);

    expect(mockRemovePlan).toHaveBeenCalledWith('proj1', 'local1');
  });

  it('handles linking an unassigned plan to the project', async () => {
    render(<ProjectDetailView projectId="proj1" />);

    // Wait for async fetch to update state
    await waitFor(() => {
      expect(screen.getByText('Local Blueprint 1')).toBeInTheDocument();
    });

    const linkBtn = screen.getByRole('button', { name: 'Link Plan' });
    fireEvent.click(linkBtn);

    // Modal should be open. "Online Blueprint 1" is unassigned and should be visible.
    const onlineOption = screen.getByText('Online Blueprint 1');
    expect(onlineOption).toBeInTheDocument();
    expect(screen.getByText('online · 5 items')).toBeInTheDocument();

    // Click it to link
    fireEvent.click(onlineOption);

    expect(mockAssignPlan).toHaveBeenCalledWith('proj1', 'online1');
  });

  it('allows creating a new floor plan and links it to project', async () => {
    render(<ProjectDetailView projectId="proj1" />);

    await waitFor(() => {
      expect(screen.getByText('Local Blueprint 1')).toBeInTheDocument();
    });

    const createBtn = screen.getByRole('button', { name: 'Create Plan' });
    fireEvent.click(createBtn);

    // Form modal should open
    const titleInput = screen.getByPlaceholderText('e.g. Executive Cabin Blueprint');
    fireEvent.change(titleInput, { target: { value: 'New Cabinet Layout' } });

    const submitBtn = screen.getByRole('button', { name: 'Create & Launch' });
    fireEvent.click(submitBtn);

    // Should create key in localStorage and index
    const indexStr = localStorage.getItem('planner_project_index');
    expect(indexStr).toBeDefined();
    const index = JSON.parse(indexStr!);
    expect(index[0].name).toBe('New Cabinet Layout');

    // Should call store link action
    expect(mockAssignPlan).toHaveBeenCalledWith('proj1', expect.stringContaining('plan-'));

    // Should push to router canvas
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/planner/canvas?id=plan-'));
  });

  it('recovers from corrupt planner_project_index when creating a plan', async () => {
    localStorage.setItem('planner_project_index', '{not-valid-json');
    render(<ProjectDetailView projectId="proj1" />);

    await waitFor(() => {
      expect(screen.getByText('Local Blueprint 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create Plan' }));
    fireEvent.change(screen.getByPlaceholderText('e.g. Executive Cabin Blueprint'), {
      target: { value: 'Recovered Layout' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create & Launch' }));

    const index = JSON.parse(localStorage.getItem('planner_project_index')!);
    expect(index).toHaveLength(1);
    expect(index[0].name).toBe('Recovered Layout');
    expect(mockAssignPlan).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalled();
  });

  it('uses compact embedded chrome without GlobalNavHeader', async () => {
    render(<ProjectDetailView projectId="proj1" embedded />);

    expect(screen.queryByTestId('mock-global-nav-header')).not.toBeInTheDocument();
    expect(screen.queryByText('Project Detail')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: 'Project Alpha' })).toBeInTheDocument();
    });
  });
});
