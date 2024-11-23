import AutomationBuilder from '@/app/components/AutomationBuilder';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ReactFlowProvider } from '@xyflow/react';

const mockLocalStorageGetItem = jest.fn();
const mockLocalStorageSetItem = jest.fn();
const mockLocalStorageRemoveItem = jest.fn();

global.localStorage.getItem = mockLocalStorageGetItem;
global.localStorage.setItem = mockLocalStorageSetItem;
global.localStorage.removeItem = mockLocalStorageRemoveItem;

jest.mock('../app/contexts/DnDContext', () => ({
  useDnD: jest.fn(),
}));

describe('AutomationBuilder', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mockUseDnD = require('../app/contexts/DnDContext').useDnD;
    mockUseDnD.mockReturnValue({
      type: 'email',
      name: 'Email Node',
      setType: jest.fn(),
      setName: jest.fn(),
    });

    mockLocalStorageGetItem.mockReturnValueOnce(
      JSON.stringify({ nodes: [], edges: [] })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial data', async () => {
    render(
      <ReactFlowProvider>
        <AutomationBuilder />
      </ReactFlowProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/You can drag these nodes/)).toBeInTheDocument();
    });
  });

  test('handles drag-and-drop correctly', async () => {
    render(
      <ReactFlowProvider>
        <AutomationBuilder />
      </ReactFlowProvider>
    );

    const draggableNode = screen.getByText('Input Node');

    const mockDataTransfer = {
      setData: jest.fn(),
      getData: jest.fn(),
      effectAllowed: '',
    };

    fireEvent.dragStart(draggableNode, {
      dataTransfer: mockDataTransfer,
    });

    const dropArea = screen.getByTestId('reactflow-wrapper');

    fireEvent.drop(dropArea, {
      dataTransfer: mockDataTransfer,
      clientX: 100,
      clientY: 100,
    });

    await waitFor(() => {
      expect(screen.getByText('Input Node')).toBeInTheDocument();
    });
  });

  it('displays snackbar with success message after save', async () => {
    render(
      <ReactFlowProvider>
        <AutomationBuilder />
      </ReactFlowProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Save/ }));

    await waitFor(() => {
      expect(
        screen.getByText('Automation saved successfully')
      ).toBeInTheDocument();
    });
  });
});
