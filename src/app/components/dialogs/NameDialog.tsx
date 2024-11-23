'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

type NameDialogProps = {
  isOpen: boolean;
  nodeName: string;
  onSave: (name: string) => void;
  onClose: () => void;
};

const NameDialog = ({ isOpen, nodeName, onSave, onClose }: NameDialogProps) => {
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
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Node Name</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <TextField
            label="New node name"
            value={name}
            type="text"
            variant="filled"
            fullWidth
            placeholder="Type it"
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
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NameDialog;
