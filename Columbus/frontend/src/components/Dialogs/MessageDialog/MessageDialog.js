import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
const MessageDialog = ({ open, handleClose, isDeleted, txt }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {txt}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {isDeleted ? 
                     <Button href="/" variant="contained" color="primary">
                        OK
                      </Button>
                    :
                    <Button onClick={handleClose} variant="contained" color="primary">
                        OK
                    </Button>
                    }
       
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialog;
