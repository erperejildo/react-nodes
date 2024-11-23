'use client';

import { Box, Button, Modal, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
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
      setError('This cannot be empty');
      return;
    }
    onSave(name.trim());
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className="modal-container">
        <h2 className="child-modal-title">Change Name</h2>
        <div className="child-modal-description">
          <TextField
            label="New node name"
            value={name}
            type="text"
            variant="outlined"
            fullWidth
            placeholder="Enter a new name"
            error={error !== ''}
            helperText={error}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
            onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter') {
                handleSave();
              }
            }}
          />
        </div>
        <Box className="modal-buttons">
          <Button
            onClick={onClose}
            variant="contained"
            color="error"
            aria-label="Cancel node name"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            aria-label="Save node name"
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default NodeModal;
