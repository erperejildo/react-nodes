import { fireEvent, render, screen } from '@testing-library/react';
import Sidebar from '../app/components/Sidebar';
import { DnDProvider } from '../app/contexts/DnDContext';

describe('Sidebar Component', () => {
  const mockOnSave = jest.fn();

  const renderSidebar = () => {
    render(
      <DnDProvider>
        <Sidebar onSave={mockOnSave} />
      </DnDProvider>
    );
  };

  it('renders all default nodes with correct names', () => {
    renderSidebar();

    expect(screen.getByText('Input Node')).toBeInTheDocument();
    expect(screen.getByText('Default Node')).toBeInTheDocument();
    expect(screen.getByText('Output Node')).toBeInTheDocument();
  });

  it('calls onSave when save button is clicked', () => {
    renderSidebar();

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('opens the modal when clicking "Change Name" button', () => {
    renderSidebar();

    const changeNameButtons = screen.getAllByRole('button', {
      name: /change name for/i,
    });
    fireEvent.click(changeNameButtons[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter node name')).toHaveValue(
      'Input Node'
    );
  });

  it('updates the node name via the modal', () => {
    renderSidebar();

    const changeNameButtons = screen.getAllByRole('button', {
      name: /change name for/i,
    });
    fireEvent.click(changeNameButtons[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const inputField = screen.getByPlaceholderText('Enter node name');
    fireEvent.change(inputField, { target: { value: 'Updated Input Node' } });

    const saveButton = screen.getByRole('button', { name: /Save node name/i });
    fireEvent.click(saveButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Updated Input Node')).toBeInTheDocument();
  });
});
