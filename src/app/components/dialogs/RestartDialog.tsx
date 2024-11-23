'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type RestartDialogProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const RestartDialog = ({ isOpen, onCancel, onConfirm }: RestartDialogProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
    >
      <DialogTitle>Discard all changes?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to discard all your changes?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestartDialog;
