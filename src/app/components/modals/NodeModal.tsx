'use client';

import { useState } from 'react';
import './NodeModal.css';

type NodeModalProps = {
  isOpen: boolean;
  nodeName: string;
  onSave: (name: string) => void;
  onClose: () => void;
};

const NodeModal = ({ isOpen, nodeName, onSave, onClose }: NodeModalProps) => {
  const [name, setName] = useState(nodeName);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(name);
    onClose();
  };

  return (
    <div className="node-modal-overlay">
      <div className="node-modal">
        <h3>Edit Node</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter node name"
        />
        <div className="node-modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default NodeModal;
