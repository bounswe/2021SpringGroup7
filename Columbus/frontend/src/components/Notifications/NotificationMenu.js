import {React, useState, useEffect} from "react";

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
            import ListItem from '@mui/material/ListItem';

import Notification from "./Notification";
import USER_SERVICE from '../../services/user';

export default function NotificationMenu(props) { 

const { isNotificationsOpen, setIsNotificationsOpen, isNotificationMenuOpen } = props;

const [notifications, setNotifications] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {

        USER_SERVICE.GET_NOTIFICATIONS(localStorage.getItem('username'))
            .then((res) => {
              setNotifications(res.data.notifications.orderedItems)
              setIsLoading(false);
            })
            .catch((error) => {

            })
    }, [isNotificationsOpen])


const handleNotificationsClose = () => {
  setIsNotificationsOpen(null);
}

const renderNotifications = (
    <Menu
      id="long-menu"
      anchorEl={isNotificationsOpen}
      open={isNotificationMenuOpen}
      onClose={handleNotificationsClose}
      MenuListProps={{
        'aria-labelledby': 'long-button',
      }}
      PaperProps={{
        style: { maxHeight: 64 * 4.5, width: '50ch'}
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      >
      {notifications.map((notification) => (
        <>
        <Divider textAlign="right">{'1 min ago'}</Divider>
          <ListItem key={notification} >
            <Notification  notification={notification}></Notification>
          </ListItem>
        </>
      ))}
      <Divider />
    </Menu>
    );

 return (
    <>
        {renderNotifications}
    </>

  );

}








