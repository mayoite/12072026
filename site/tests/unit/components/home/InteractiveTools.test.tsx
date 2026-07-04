import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InteractiveTools } from '@/components/home/InteractiveTools';

vi.mock('@/features/planner/landing/PlannerToolsShowcase', () => ({
  PlannerToolsShowcase: (props: any) => (
    <div data-testid="mock-tools-showcase">
      <span>Title: {props.title.lead} - {props.title.accent}</span>
      <span>Kicker: {props.kicker}</span>
      <span>CTA: {props.primaryCta.label} ({props.primaryCta.href})</span>
    </div>
  )
}));

describe('InteractiveTools Component', () => {
  it('renders PlannerToolsShowcase delegate with correct props', () => {
    render(<InteractiveTools />);

    expect(screen.getByTestId('mock-tools-showcase')).toBeInTheDocument();
    expect(screen.getByText('Title: Design your - workspace')).toBeInTheDocument();
    expect(screen.getByText('Kicker: Workspace planning')).toBeInTheDocument();
    expect(screen.getByText(/Launch planner/)).toBeInTheDocument();
  });
});
