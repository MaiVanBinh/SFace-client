import React from 'react';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Button } from '@mui/material';

const Formdialogs = (props) => {
  const { title, acceptAction, denyAction, close, open } = props;

  return (
    <Dialog open={open} onClose={denyAction && denyAction.action}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{props.children}</DialogContent>
      <DialogActions>
        <Button onClick={denyAction && denyAction.action}>{denyAction && denyAction.title}</Button>
        <Button onClick={acceptAction && acceptAction.action}>
          {acceptAction && acceptAction.title}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default Formdialogs;
