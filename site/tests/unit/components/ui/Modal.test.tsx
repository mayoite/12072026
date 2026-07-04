import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Modal } from '@/components/ui/Modal';

describe('Modal Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();

    // Mock HTMLDialogElement methods that are not fully implemented in JSDOM
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });

    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    });
  });

  it('calls showModal when open is true, and close when false', () => {
    const { rerender, container } = render(
      <Modal open={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    const dialog = container.querySelector('dialog') as HTMLDialogElement;
    expect(dialog).not.toHaveAttribute('open');

    rerender(
      <Modal open={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    expect(dialog).toHaveAttribute('open');

    rerender(
      <Modal open={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    expect(dialog).not.toHaveAttribute('open');
  });

  it('renders title and triggers onClose when clicking the close button', () => {
    render(
      <Modal open={true} onClose={mockOnClose} title="Test Modal Title">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Test Modal Title')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: 'Close dialog' });
    fireEvent.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('triggers onClose when backdrop is clicked', () => {
    const { container } = render(
      <Modal open={true} onClose={mockOnClose} title="Title">
        <div>Content</div>
      </Modal>
    );

    const dialog = container.querySelector('dialog') as HTMLDialogElement;

    // Click inside the dialog container structure (e.g. content) - should not trigger onClose
    const content = screen.getByText('Content');
    fireEvent.click(content);
    expect(mockOnClose).not.toHaveBeenCalled();

    // Click target is the dialog itself (the backdrop)
    fireEvent.click(dialog);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('registers/unregisters native close event listener', () => {
    const { unmount, container } = render(
      <Modal open={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    const dialog = container.querySelector('dialog') as HTMLDialogElement;
    
    // Simulate native close event dispatched by the browser (or esc key)
    dialog.dispatchEvent(new Event('close'));
    expect(mockOnClose).toHaveBeenCalled();

    unmount();
  });
});
