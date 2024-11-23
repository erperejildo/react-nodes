import NodeModal from '@/app/components/modals/NodeModal';
import { fireEvent, render, screen } from '@testing-library/react';

describe('NodeModal Component', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open with the provided node name', () => {
    render(
      <NodeModal
        isOpen={true}
        nodeName="Test Node"
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('document')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter node name')).toHaveValue(
      'Test Node'
    );
  });

  it('displays an error when attempting to save with an empty name', () => {
    render(
      <NodeModal
        isOpen={true}
        nodeName=""
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(screen.getByText('Node name cannot be empty')).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onSave when valid input is provided', () => {
    render(
      <NodeModal
        isOpen={true}
        nodeName="Initial Name"
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const input = screen.getByPlaceholderText('Enter node name');
    const saveButton = screen.getByText('Save');

    fireEvent.change(input, { target: { value: '  New Node Name  ' } });
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith('New Node Name');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes the modal when Enter is pressed and input is valid', () => {
    render(
      <NodeModal
        isOpen={true}
        nodeName="Initial Name"
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const input = screen.getByPlaceholderText('Enter node name');

    fireEvent.change(input, { target: { value: 'Node via Enter' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(mockOnSave).toHaveBeenCalledWith('Node via Enter');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when the "Cancel" button is clicked', () => {
    render(
      <NodeModal
        isOpen={true}
        nodeName="Test Node"
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('updates the input value as the user types', () => {
    render(
      <NodeModal
        isOpen={true}
        nodeName="Test Node"
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const input = screen.getByPlaceholderText('Enter node name');

    fireEvent.change(input, { target: { value: 'Updated Node Name' } });

    expect(input).toHaveValue('Updated Node Name');
  });

  it('does not render anything when isOpen is false', () => {
    render(
      <NodeModal
        isOpen={false}
        nodeName="Test Node"
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
