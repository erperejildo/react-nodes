import { fireEvent, render, screen } from '@testing-library/react';
import Sidebar from '../app/components/Sidebar';
import { DnDProvider } from '../app/contexts/DnDContext';

describe('Sidebar Component', () => {
  const mockOnSave = jest.fn();
  const mockOnRestart = jest.fn();

  const renderSidebar = () => {
    render(
      <DnDProvider>
        <Sidebar onSave={mockOnSave} onRestart={mockOnRestart} />
      </DnDProvider>
    );
  };

  it('renders all default nodes with correct names', () => {
    renderSidebar();

    expect(screen.getByText('Input Node')).toBeInTheDocument();
    expect(screen.getByText('Default Node')).toBeInTheDocument();
    expect(screen.getByText('Output Node')).toBeInTheDocument();
  });

  it('calls Save when save button is clicked', () => {
    renderSidebar();

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('opens dialog and updates node name', () => {
    renderSidebar();

    const changeNameButtons = screen.getAllByRole('button', {
      name: /edit name for/i,
    });
    fireEvent.click(changeNameButtons[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const inputField = screen.getByPlaceholderText('Type it');
    fireEvent.change(inputField, { target: { value: 'Updated Input Node' } });

    const saveButton = screen.getByRole('button', { name: /Save node name/i });
    fireEvent.click(saveButton);

    expect(screen.getByText('Updated Input Node')).toBeInTheDocument();
  });
});
