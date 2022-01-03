import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';


import {TabPanel, a11yProps} from './Admin.helpers'
import ADMIN_SERVICE from '../../services/admin';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ReportedUser from './ReportedUser'

function Admin() {
  const [value, setValue] = useState(0);
  const [userAction, setUserAction]   = useState(false);
  const [storyAction, setStoryAction] = useState(false);
  const [commentAction, setCommentAction] = useState(false);
  const [tagAction, setTagAction] = useState(false);

  const [reportedUser, setReportedUser] = useState({'reported_user': {}, 
                                                    'report_text': '', 
                                                    'report_id': 0
                                                })
  const [reportedStory, setReportedStory] = useState(null)
  const [reportedComment, setReportedComment] = useState(null)
  const [reportedTag, setReportedTag] = useState(null)

  useEffect(() => 
  {
    ADMIN_SERVICE.GET_REPORTEDUSER()
      .then((res) => {
          console.log('reuslt ', res.data.return)
          setReportedUser(res.data.return)
        })
      .catch((error) => {

      });

    }, [value,userAction]);


   useEffect(() => 
  {
    ADMIN_SERVICE.GET_REPORTEDSTORY()
      .then((res) => {
          console.log('story ', res.data.return)
          setReportedStory(res.data.return)
        })
      .catch((error) => {

      });

    }, [value,storyAction]);


  const handleChange = (event, newValue) => 
  {
    setValue(newValue);
  };



  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="basic tabs example">
          <Tab label="Users" {...a11yProps(0)} />
          <Tab label="Stories" {...a11yProps(1)} />
          <Tab label="Comments" {...a11yProps(2)} />
          <Tab label="Tags" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        
        <ReportedUser reportedUser={reportedUser} setUserAction={setUserAction}></ReportedUser>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Stories
      </TabPanel>
      <TabPanel value={value} index={2}>
        Comments
      </TabPanel>
      <TabPanel value={value} index={3}>
        Tags
      </TabPanel>
    </Box>
  );
}

export default Admin;


/*
 <Box sx={{width:'100%'}}>
         <List>
            <ListItem
             secondaryAction={
                    <Stack direction="row" spacing={1}>
                        <Button 
                            variant="contained"
                            edge="end" 
                            aria-label="delete"
                            color="success"
                            endIcon={<CheckIcon/>}>
                        Safe
                        </Button>
                        <Button 
                            variant="contained"
                            edge="end" 
                            aria-label="delete"
                            color="error"
                            endIcon={<PriorityHighIcon/>}>
                        Unsafe
                        </Button>
                    </Stack>
                  }>
            <ListItemAvatar>
                <Avatar src={reportedUser['reported_user']['photo_url']}>
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={reportedUser['reported_user']['username']}
                secondary={'ok'}
            />
            </ListItem>                            
            </List>
                Report Details
            Report Reason
            </Box>



*/





