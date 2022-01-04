import {React, useState, useEffect} from "react";

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Notification from "./Notification";
import FollowRequest from "./FollowRequest";
import USER_SERVICE from '../../services/user';

export default function NotificationMenu(props) { 

const { isNotificationsOpen, setIsNotificationsOpen, isNotificationMenuOpen } = props;

const [notifications, setNotifications] = useState([]);
const [followRequests, setFollowRequests] = useState([]);
const [requestIDs, setRequestIDs] = useState([]);

const [tabValue, setTabValue] = useState('activity');
const [infoLoading, setInfoLoading] = useState(true);

  useEffect(() => {

        setInfoLoading(true);
        USER_SERVICE.GET_NOTIFICATIONS(localStorage.getItem('username'))
            .then((res) => {
              setNotifications(res.data.other_notifications.orderedItems);
              setFollowRequests(res.data.follow_requests.orderedItems);
              setInfoLoading(false);
            })
            .catch((error) => {

            })

    }, [isNotificationsOpen, tabValue])

  
   useEffect(() => {

        setInfoLoading(true);
        USER_SERVICE.GET_FOLLOWREQUEST()
            .then((res) => {
              setRequestIDs(res.data.return);
              setInfoLoading(false);
            })
            .catch((error) => {

            })
    }, [isNotificationsOpen,tabValue])


  const handleNotificationsClose = () => {
    setIsNotificationsOpen(null);
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

const renderLoadingMenu = (
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
      <ListItem key={'tab'}>
          <CircularProgress />
      </ListItem>
      <Divider />
    </Menu>
    );




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
      <ListItem key={'tab'}>
          <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              variant="fullWidth"
            >
              <Tab 
                value="activity" 
                label="Activity" />
              <Tab 
                value="followRequests" 
                label="Follow Requests" />
          </Tabs>
      </ListItem>
      <List>
        { notifications.length == 0 ? <>
                                      <Divider></Divider>
                                        <ListItem> 
                                          {'No activities to view.'}
                                        </ListItem>
                                      </>
                                    :
                                    <>
                                    {notifications.map((notification) => (
                                                                <>
                                                                <Divider component="li"/>
                                                                <li>
                                                                  <Typography
                                                                    sx={{ mt: 0.5, mr: 2, textAlign:"right"}}
                                                                    color="text.secondary"
                                                                    display="block"
                                                                    variant="caption"
                                                                  >
                                                                    {(new Date(notification['date'])).toLocaleString()}
                                                                  </Typography>
                                                                </li>
                                                                
                                                                  <ListItem key={notification}>
                                                                    <Notification  notification={notification}></Notification>
                                                                  </ListItem>
                                                                </>
                                                        ))
                                      }
                                    </>
        }
      </List>
      <Divider />
    </Menu>
    );


  const renderFollowRequests = (
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
      <ListItem key={'tab'}>
          <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              variant="fullWidth"
            >
              <Tab 
                value="activity" 
                label="Activity" />
              <Tab 
                value="followRequests" 
                label="Follow Requests" />
          </Tabs>
      </ListItem>
      <List>
        {requestIDs.length == 0 ? <>
                                    <Divider textAlign="right"></Divider>
                                      <ListItem> 
                                        {'You have no requests yet.'}
                                      </ListItem>
                                      </>
                                  : <>{requestIDs.map((request) => (
                                    <>
                                    <Divider textAlign="right"></Divider>
                                      <ListItem key={request}>
                                        <FollowRequest  
                                          request={request} 
                                          closeNotifications={handleNotificationsClose}/>
                                      </ListItem>
                                    </>
                                  ))}</>
         }
      </List>
      <Divider />
    </Menu>
    );


  if(infoLoading) 
  {
    return (
          <>
          {renderLoadingMenu}
          </>
        );
  }

  if(tabValue !== 'activity') 
  {
    return (
          <>
          {renderFollowRequests}
          </>
        );
  }

  else 
  {
      return (
          <>
          {renderNotifications}
          </>
        );
  }

}