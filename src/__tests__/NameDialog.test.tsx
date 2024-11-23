import NameDialog from '@/app/components/dialogs/NameDialog';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const onSaveMock = jest.fn();
const onCloseMock = jest.fn();

describe('NameDialog', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when opened', () => {
    render(
      <NameDialog
        isOpen={true}
        nodeName="Test Node"
        onSave={onSaveMock}
        onClose={onCloseMock}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/New node name/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <NameDialog
        isOpen={false}
        nodeName="Test Node"
        onSave={onSaveMock}
        onClose={onCloseMock}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('updates input value as user types', () => {
    render(
      <NameDialog
        isOpen={true}
        nodeName="Test Node"
        onSave={onSaveMock}
        onClose={onCloseMock}
      />
    );

    const input = screen.getByLabelText(/New node name/i);
    fireEvent.change(input, { target: { value: 'New Node Name' } });

    expect(input).toHaveValue('New Node Name');
  });

  it('shows error when trying to save an empty name', async () => {
    render(
      <NameDialog
        isOpen={true}
        nodeName="Test Node"
        onSave={onSaveMock}
        onClose={onCloseMock}
      />
    );

    const saveButton = screen.getByRole('button', { name: /Save/i });

    fireEvent.change(screen.getByLabelText(/New node name/i), {
      target: { value: '' },
    });
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(screen.getByText(/This cannot be empty/i)).toBeInTheDocument()
    );
  });

  it('calls onSave and onClose when Save button is clicked with a valid name', async () => {
    render(
      <NameDialog
        isOpen={true}
        nodeName="Test Node"
        onSave={onSaveMock}
        onClose={onCloseMock}
      />
    );

    const input = screen.getByLabelText(/New node name/i);
    const saveButton = screen.getByRole('button', { name: /Save/i });

    fireEvent.change(input, { target: { value: 'Updated Node Name' } });
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(onSaveMock).toHaveBeenCalledWith('Updated Node Name')
    );
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(
      <NameDialog
        isOpen={true}
        nodeName="Test Node"
        onSave={onSaveMock}
        onClose={onCloseMock}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });

    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
