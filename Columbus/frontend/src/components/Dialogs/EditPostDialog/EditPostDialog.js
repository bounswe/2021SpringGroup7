import React,{ useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from '@mui/material/DialogTitle';

const EditPostDialog = ({ open, handleClose, edit ,topic,story}) => {
  const [topic1, setTopic] = useState(topic);
  const [story1, setStory] = useState(story);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
          Edit Post
        </DialogTitle>
       <DialogContent dividers>
            <Box 
                component="form" 
                onSubmit={edit} 
                id="editPost-form"
                ><TextField
                id="topic-label"
                name="topic"
                label="Topic"
                margin="dense"
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
                    id="story-label"
                    name="story"
                    label="Story"
                    margin="dense"
                    multiline
                    value={story1}
                    onChange={(e) => setStory(e.target.value)}
                    rows={4}
                    variant="filled"
                    autoFocus
                    required
                    />
                    <Button onClick={handleClose} variant="outlined" color="error">
            CANCEL
            </Button>
            <Button type="submit" variant="contained" color="error">
            Edit
            </Button>
            </Box>
        </DialogContent>

    </Dialog>
  );
};

export default EditPostDialog;