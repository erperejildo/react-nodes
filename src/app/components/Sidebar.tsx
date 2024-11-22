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
    <aside className="sidebar" role="complementary" aria-label="Node Sidebar">
      <div className="description" aria-live="polite">
        You can drag these nodes.
      </div>

      {Object.entries(defaultNames).map(([type, name]) => (
        <div key={type} className="node-option">
          <button
            className="edit-default-name-button"
            onClick={() => handleEditClick(type)}
            aria-label={`Change name for ${name}`}
          >
            Change Name
          </button>
          <div
            className={`dndnode ${type}`}
            onDragStart={(event) => onDragStart(event, type, name)}
            draggable
            role="button"
            tabIndex={0}
            aria-label={`Draggable ${name}`}
          >
            {name}
          </div>
        </div>
      ))}

      <button
        className="save-button"
        onClick={onSave}
        aria-label="Save changes"
      >
        Save
      </button>

      <NodeModal
        isOpen={isModalOpen}
        nodeName={
          currentType
            ? defaultNames[currentType as keyof typeof defaultNames]
            : defaultNames.default
        }
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
    </aside>
  );
};

export default Sidebar;
