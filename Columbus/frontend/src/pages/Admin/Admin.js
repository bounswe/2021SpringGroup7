import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import {TabPanel, a11yProps} from './Admin.helpers'
import ADMIN_SERVICE from '../../services/admin';

import ReportedUser from './ReportedUser'
import ReportedStory from './ReportedStory';

function Admin() {
  const [value, setValue] = useState(0);
  const [userAction, setUserAction]   = useState(false);
  const [storyAction, setStoryAction] = useState(false);

  const [reportedUser, setReportedUser] = useState({'reported_user': {}, 
                                                    'report_text': '', 
                                                    'report_id': 0
                                                })
  const [reportedStory, setReportedStory] = useState([{'reported_story': {}, 
                                                    'report_text': '', 
                                                    'reporter_id': 0,
                                                    'report_id': 0
                                                }])

  useEffect(() => 
  {
    ADMIN_SERVICE.GET_REPORTEDUSER()
      .then((res) => {
          setReportedUser(res.data.return)
        })
      .catch((error) => {

      });

    }, [value,userAction]);


   useEffect(() => 
  {
    ADMIN_SERVICE.GET_REPORTEDSTORY()
      .then((res) => {
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
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ReportedUser reportedUser={reportedUser} userAction={userAction} setUserAction={setUserAction}></ReportedUser>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ReportedStory reportedStory={reportedStory[0]} storyAction={storyAction} setStoryAction={setStoryAction}></ReportedStory>
      </TabPanel>
    </Box>
  );
}

export default Admin;




