import Button from '@mui/material/Button/Button';
import { useState } from 'react';
import { useDnD } from '../contexts/DnDContext';
import NodeModal from './modals/NodeModal';
import './styles.css';

const Sidebar = ({ onSave }: { onSave: () => void }) => {
  const { setType, setName } = useDnD();
  const [defaultNames, setDefaultNames] = useState({
    input: 'Input Node',
    default: 'Default Node',
    output: 'Output Node',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentType, setCurrentType] = useState<string | null>(null);

  const onDragStart = (
    event: React.DragEvent,
    nodeType: string,
    nodeName: string
  ) => {
    setType(nodeType);
    setName(nodeName);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleEditClick = (nodeType: string) => {
    setCurrentType(nodeType);
    setIsModalOpen(true);
  };

  const handleSave = (name: string) => {
    if (currentType) {
      setDefaultNames((prev) => ({ ...prev, [currentType]: name }));
    }
    setIsModalOpen(false);
  };

  return (
    <aside className="sidebar">
      <div className="description">You can drag these nodes.</div>

      {Object.entries(defaultNames).map(([type, name]) => (
        <div key={type} className="node-option">
          <button
            className="edit-default-name-button"
            onClick={() => handleEditClick(type)}
          >
            Change Name
          </button>
          <div
            className={`dndnode ${type}`}
            onDragStart={(event) => onDragStart(event, type, name)}
            draggable
          >
            {name}
          </div>
        </div>
      ))}

      <Button
        variant="contained"
        className="save-button"
        fullWidth
        onClick={onSave}
      >
        Save
      </Button>

      <NodeModal
        isOpen={isModalOpen}
        nodeName={defaultNames[currentType || '']}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
    </aside>
  );
};

export default Sidebar;
