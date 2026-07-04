import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ProjectsView from '@/features/crm/ProjectsView';
import { useCrmStore } from '@/features/crm/stores/crmStore';

const mockProjects = [
  { id: '1', name: 'Project Alpha', clientId: 'c1', status: 'active' as const, notes: 'Brief for alpha', planIds: ['p1'], createdAt: '2026-06-25T00:00:00Z', updatedAt: '2026-06-26T00:00:00Z' },
  { id: '2', name: 'Project Beta', clientId: 'none', status: 'on_hold' as const, notes: '', planIds: [] as string[], createdAt: '2026-06-25T00:00:00Z', updatedAt: '2026-06-26T00:00:00Z' }
];
const mockClients = [
  { id: 'c1', name: 'Client Acme', company: 'Acme Corp' }
];

const mockAddProject = vi.fn();
const mockDeleteProject = vi.fn();

vi.mock('@/features/crm/stores/crmStore', () => ({
  useCrmStore: vi.fn(() => ({
    projects: mockProjects,
    clients: mockClients,
    addProject: mockAddProject,
    deleteProject: mockDeleteProject,
  })),
}));

vi.mock('@/features/shared/shell/GlobalNavHeader', () => ({
  GlobalNavHeader: () => <div data-testid="mock-global-nav-header">Header</div>,
}));

describe('ProjectsView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders GlobalNavHeader when embedded is false', () => {
    render(<ProjectsView embedded={false} />);
    expect(screen.getByTestId('mock-global-nav-header')).toBeInTheDocument();
  });

  it('displays the projects statistics grid correctly', () => {
    render(<ProjectsView />);
    expect(screen.getByText('Total Projects').nextElementSibling).toHaveTextContent('2');
    expect(screen.getByText('Active Projects').nextElementSibling).toHaveTextContent('1');
    expect(screen.getAllByText('On Hold')[0].nextElementSibling).toHaveTextContent('1');
    expect(screen.getByText('Completed').nextElementSibling).toHaveTextContent('0');
  });

  it('groups and lists projects under client categories', () => {
    render(<ProjectsView />);

    expect(screen.getByRole('heading', { name: 'Client Acme' })).toBeInTheDocument();
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Brief for alpha')).toBeInTheDocument();
    expect(screen.getByText('1 floor plan')).toBeInTheDocument();

    expect(screen.getByText('Unassigned Clients')).toBeInTheDocument();
    expect(screen.getByText('Project Beta')).toBeInTheDocument();
    expect(screen.getByText('0 floor plans')).toBeInTheDocument();
  });

  it('calls deleteProject when delete button is clicked', () => {
    render(<ProjectsView />);

    const deleteBtns = screen.getAllByTitle('Delete project');
    fireEvent.click(deleteBtns[0]); // delete project 1

    expect(mockDeleteProject).toHaveBeenCalledWith('1');
  });

  it('opens modal, configures and creates a new project', () => {
    render(<ProjectsView />);

    const newBtn = screen.getByRole('button', { name: /New Project/i });
    fireEvent.click(newBtn);

    const nameInput = screen.getByPlaceholderText('e.g. Nexus Office Level 4');
    const clientSelect = screen.getByRole('combobox', { name: /Client Association/i });
    const statusSelect = screen.getByRole('combobox', { name: /Initial Status/i });
    const notesInput = screen.getByPlaceholderText('Design specs, seat requirements...');

    fireEvent.change(nameInput, { target: { value: 'Project Gamma' } });
    fireEvent.change(clientSelect, { target: { value: 'c1' } });
    fireEvent.change(statusSelect, { target: { value: 'completed' } });
    fireEvent.change(notesInput, { target: { value: 'Finished layout design' } });

    const submitBtn = screen.getByRole('button', { name: 'Create Project' });
    fireEvent.click(submitBtn);

    expect(mockAddProject).toHaveBeenCalledWith({
      name: 'Project Gamma',
      clientId: 'c1',
      status: 'completed',
      notes: 'Finished layout design',
    });
  });

  it('renders empty state when there are no projects in store', () => {
    vi.mocked(useCrmStore).mockReturnValueOnce({
      projects: [],
      clients: mockClients,
      addProject: mockAddProject,
      deleteProject: mockDeleteProject,
    });

    render(<ProjectsView />);

    expect(screen.getByText('No projects yet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
  });
});
