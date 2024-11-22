'use client';

import { useEffect, useState } from 'react';
import './NodeModal.css';

type NodeModalProps = {
  isOpen: boolean;
  nodeName: string;
  onSave: (name: string) => void;
  onClose: () => void;
};

const NodeModal = ({ isOpen, nodeName, onSave, onClose }: NodeModalProps) => {
  const [name, setName] = useState(nodeName);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(nodeName);
      setError('');
    }
  }, [isOpen, nodeName]);

  const handleSave = () => {
    if (name.trim() === '') {
      setError('Node name cannot be empty');
      return;
    }
    onSave(name.trim());
    onClose();
  };

  return isOpen ? (
    <div className="node-modal-overlay" role="dialog" aria-modal="true">
      <div className="node-modal" role="document">
        <h3 id="node-modal-title">Node Name</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          placeholder="Enter node name"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave();
            }
          }}
          aria-labelledby="node-modal-title"
          aria-describedby="node-modal-error"
        />
        {error && (
          <p id="node-modal-error" className="node-modal-error">
            {error}
          </p>
        )}
        <div className="node-modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default NodeModal;
