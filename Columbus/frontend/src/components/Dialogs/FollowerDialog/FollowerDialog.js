import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import PersonIcon from '@mui/icons-material/Person';

import { Link } from 'react-router-dom';

export default function FollowerDialog(props) {

    const { open, onClose, accounts, title } = props;

    return (
    <Dialog onClose={onClose} open={open}  scroll='paper'>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
                    <List sx={{ pt: 0 }}>
                        {accounts.map((account) => (
                            <ListItem button component={Link} to="/" key={account}>
                                <ListItemAvatar>
                                <Avatar>
                                    <PersonIcon />
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={account} />
                            </ListItem>
                            ))
                        }

                    </List>
      </DialogContent>
    </Dialog>
  );
}