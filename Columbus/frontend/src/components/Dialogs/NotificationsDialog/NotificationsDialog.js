import { Box } from "@material-ui/core";
import IconButton from '@mui/material/IconButton';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import CloseIcon from '@material-ui/icons/Close';
import Notification from '../../Notification/Notification';

import { makeStyles, styled } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
 
  
}));


export default function NotificationsDialog(props) {
    const classes = useStyles();
    const { notifications, open, onClose} = props;

    return (

    <Dialog onClose={onClose} 
            open={open}
            scroll={'paper'}
            className={classes.dialog}
            fullWidth
            >
        <DialogTitle 
            sx={{bgcolor: 'text.disabled'}}
            >
            New Notifications
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'text.primary',
                }}
                >
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        {notifications.map((notification) => (
                                        <DialogContent dividers>
                                            <Notification 
                                                notification={notification}>
                                            </Notification>
                                        </DialogContent>
        ))}

    </Dialog>
  );

}