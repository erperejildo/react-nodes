import { Button } from '@mui/material';
import { useState } from 'react';
import { useDnD } from '../contexts/DnDContext';
import NameDialog from './dialogs/NameDialog';
import RestartDialog from './dialogs/RestartDialog';
import './styles.css';

const Sidebar = ({
  onSave,
  onRestart,
}: {
  onSave: () => void;
  onRestart: () => void;
}) => {
  const { setType, setName } = useDnD();
  const [defaultNames, setDefaultNames] = useState({
    input: 'Input Node',
    default: 'Default Node',
    output: 'Output Node',
  });
  const [currentType, setCurrentType] = useState<
    keyof typeof defaultNames | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRestartDialogOpen, setIsRestartDialogOpen] = useState(false);

  const handleDragStart = (
    event: React.DragEvent,
    nodeType: keyof typeof defaultNames
  ) => {
    setType(nodeType);
    setName(defaultNames[nodeType]);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleSaveName = (name: string) => {
    if (currentType) {
      setDefaultNames({ ...defaultNames, [currentType]: name });
    }
    setIsModalOpen(false);
  };

  return (
    <aside className="sidebar" role="complementary" aria-label="Node Sidebar">
      <div className="description">You can drag these nodes.</div>
      {Object.entries(defaultNames).map(([type, name]) => (
        <div key={type} className="node-option">
          <button
            className="edit-default-name-button"
            onClick={() => {
              setCurrentType(type as keyof typeof defaultNames);
              setIsModalOpen(true);
            }}
            aria-label={`Edit name for ${name}`}
          >
            Edit Name
          </button>
          <div
            className={`dndnode ${type}`}
            onDragStart={(event) =>
              handleDragStart(event, type as keyof typeof defaultNames)
            }
            draggable
            role="button"
            tabIndex={0}
            aria-label={`Draggable ${name}`}
          >
            {name}
          </div>
        </div>
      ))}
      <Button
        variant="contained"
        color="success"
        fullWidth
        aria-label="Save changes"
        className="save-button"
        onClick={onSave}
      >
        Save
      </Button>
      <Button
        variant="contained"
        color="error"
        aria-label="Restart changes"
        fullWidth
        onClick={() => setIsRestartDialogOpen(true)}
      >
        Restart
      </Button>

      <NameDialog
        isOpen={isModalOpen}
        nodeName={currentType ? defaultNames[currentType] : ''}
        onSave={handleSaveName}
        onClose={() => setIsModalOpen(false)}
      />

      <RestartDialog
        isOpen={isRestartDialogOpen}
        onCancel={() => setIsRestartDialogOpen(false)}
        onConfirm={() => {
          onRestart();
          setIsRestartDialogOpen(false);
        }}
      />
    </aside>
  );
};

export default Sidebar;
