'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

type NameDialogProps = {
  isOpen: boolean;
  nodeName: string;
  onSave: (name: string) => void;
  onClose: () => void;
};

const NameDialog = ({ isOpen, nodeName, onSave, onClose }: NameDialogProps) => {
  const [name, setName] = useState(nodeName);

  useEffect(() => {
    if (isOpen) {
      setName(nodeName);
    }
  }, [isOpen, nodeName]);

  const handleSave = useCallback(() => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onSave(trimmedName);
    onClose();
  }, [name, onSave, onClose]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Change node name</DialogTitle>
      <DialogContent>
        <TextField
          label="New node name"
          value={name}
          type="text"
          variant="filled"
          fullWidth
          placeholder="Type it"
          error={name.trim() === ''}
          helperText={name.trim() === '' ? 'This cannot be empty' : ''}
          onChange={(event) => setName(event.target.value)}
          onBlur={handleSave}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={name.trim() === ''}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NameDialog;
