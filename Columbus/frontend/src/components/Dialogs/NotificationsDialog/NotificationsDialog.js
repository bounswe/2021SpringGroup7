import { Box } from "@material-ui/core";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';

import CloseIcon from '@material-ui/icons/Close';
import Notification from '../../Notification/Notification';

export default function NotificationsDialog(props) {
    const { notifications, open, onClose} = props;

    return (
    <Dialog onClose={onClose} open={open}>
        <Box sx={{ borderColor: 'primary', borderBottom: 1 }}>
            <DialogTitle>New Notifications</DialogTitle>
        </Box>
        <List sx={{ pt: 2 }}>
        {notifications.map((notification) => (
                                        <ListItem button onClick={onClose} key={notification}>
                                            <Notification notification={notification}></Notification>
                                        </ListItem>
        ))}

      </List>
    </Dialog>
  );

}