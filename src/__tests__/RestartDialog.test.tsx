import RestartDialog from '@/app/components/dialogs/RestartDialog';
import { fireEvent, render, screen } from '@testing-library/react';

const handleCancelMock = jest.fn();
const handleConfirmMock = jest.fn();

describe('RestartDialog', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when dialog is open', () => {
    render(
      <RestartDialog
        isOpen={true}
        onCancel={handleCancelMock}
        onConfirm={handleConfirmMock}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Discard all changes\?/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to discard all your changes\?/i)
    ).toBeInTheDocument();
  });

  it('does not render when dialog is closed', () => {
    render(
      <RestartDialog
        isOpen={false}
        onCancel={handleCancelMock}
        onConfirm={handleConfirmMock}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    render(
      <RestartDialog
        isOpen={true}
        onCancel={handleCancelMock}
        onConfirm={handleConfirmMock}
      />
    );

    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);

    expect(handleCancelMock).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when OK button is clicked', () => {
    render(
      <RestartDialog
        isOpen={true}
        onCancel={handleCancelMock}
        onConfirm={handleConfirmMock}
      />
    );

    const okButton = screen.getByText(/OK/i);
    fireEvent.click(okButton);

    expect(handleConfirmMock).toHaveBeenCalledTimes(1);
  });
});
