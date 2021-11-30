import React from "react";

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';

import Notification from "./Notification";
import {notifications} from './Notifications.data'

export default function NotificationMenu(props) { 

const { isNotificationsOpen, setIsNotificationsOpen, isNotificationMenuOpen } = props;

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
        style: { maxHeight: 48 * 4.5, width: '40ch'}
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
        <Divider textAlign="right">{notification['time']}</Divider>
          <MenuItem key={notification} onClick={handleNotificationsClose}>
            <Notification  notification={notification}></Notification>
          </MenuItem>
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








