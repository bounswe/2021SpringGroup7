import React,{ useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

const EditPostDialog = ({ open, handleClose, edit ,topic,story}) => {
  const [topic1, setTopic] = useState(topic);
  const [story1, setStory] = useState(story);
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
                onSubmit={edit} 
                id="editPost-form" 
                sx={{
                        '& .MuiTextField-root': { m: 1, width: '60ch' },
                    }}
                noValidate
                ><TextField
                error
                fullWidth
                id="topic"
                name="topic"
                label="Topic"
                margin="dense"
                multiline
                rows={1}
                value={topic1}
                onChange={(e) => setTopic(e.target.value)}
                variant="filled"
                autoFocus
                required
                />
                <TextField
                    error
                    fullWidth
                    id="story"
                    name="story"
                    label="Story"
                    margin="dense"
                    multiline
                    rows={4}
                    value = {story1}
                    onChange={(e) => setStory(e.target.value)}
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
            <Button onClick={edit} variant="contained" color="error">
            Edit
            </Button>
        </DialogActions>
    </Dialog>
  );
};

export default EditPostDialog;