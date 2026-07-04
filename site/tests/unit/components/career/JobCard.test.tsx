import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JobCard } from '@/components/career/JobCard';

vi.mock('@/components/ui/Button', () => ({
  Button: ({ children, _variant, ...props }: any) => <button {...props}>{children}</button>
}));

describe('JobCard Component', () => {
  it('renders title, department and default location correctly', () => {
    render(<JobCard title="Software Engineer" department="Engineering" />);
    
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText(/Engineering/)).toBeInTheDocument();
    expect(screen.getByText(/Patna/)).toBeInTheDocument();
  });

  it('renders custom location if provided', () => {
    render(<JobCard title="Software Engineer" department="Engineering" location="New Delhi" />);
    expect(screen.getByText(/New Delhi/)).toBeInTheDocument();
  });

  it('triggers onClick callback when button is clicked', () => {
    const handleClick = vi.fn();
    render(<JobCard title="UX Designer" department="Design" onClick={handleClick} />);
    
    const button = screen.getByRole('button', { name: 'View Details' });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
