import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

const ReportMessageDialog = ({ open, handleClose, reportUser }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
       <DialogContent dividers>
            <Box 
                component="form" 
                onSubmit={reportUser} 
                id="reportMessage-form" 
                sx={{
                        '& .MuiTextField-root': { m: 1, width: '60ch' },
                    }}
                noValidate
                >
                <TextField
                    error
                    fullWidth
                    id="reportMessage"
                    name="reportMessage"
                    label="Report Message"
                    margin="dense"
                    multiline
                    rows={4}
                    placeholder={'Please write your reason of reporting...'}
                    variant="filled"
                    autoFocus
                    required
                    />
            </Box>
        </DialogContent>

        <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="error">
            CANCEL
            </Button>
            <Button onClick={reportUser} variant="contained" color="error">
            REPORT
            </Button>
        </DialogActions>
    </Dialog>
  );
};

export default ReportMessageDialog;