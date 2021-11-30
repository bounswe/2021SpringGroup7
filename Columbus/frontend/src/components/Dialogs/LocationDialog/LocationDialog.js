import React from "react";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import LocationOn from "@material-ui/icons/LocationOn";
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
const LocationDialog = ({ open, handleClose,  txt }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <LocationOn />
              </ListItemIcon>
              <ListItemText primary="Ankara" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <LocationOn />
              </ListItemIcon>
              <ListItemText primary="İstanbul" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
    </Dialog>
  );
};

export default LocationDialog;
