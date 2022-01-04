import React, { useState, useEffect } from "react";

import {CircularProgress, Typography } from "@material-ui/core";
import { NavLink } from 'react-router-dom'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import Post from '../Post/Post'
import USER_SERVICE from "../../services/user";
import { useStyles } from './PostScroll.styles'
import {TabPanel, a11yProps} from '../../pages/Admin/Admin.helpers'

function ExplorePostScroll() {

  const classes = useStyles();
  const [value, setValue] = useState(0);
  
  const [mostLikedPosts, setMostLikedPosts] = useState([]);
  const [mostCommentedPosts, setMostCommentedPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const handleChange = (event, newValue) => 
  {
    setValue(newValue); 
  };


  useEffect(() => {
    
     USER_SERVICE.EXPLORE().then((res) => {
                                setMostLikedPosts(res.data.return['most_liked_posts'])
                                setMostCommentedPosts(res.data.return['most_commented_posts'])
                                setMostCommentedPosts(res.data.return['latest_posts'])
                                setIsLoading(false);  
                            })
                            .catch((error) => {

                            });
    }, []);

   
  if(isLoading) {
    return <CircularProgress color="success" />
  }
  return (
  
  <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="basic tabs example"
            textColor="primary"
            indicatorColor="primary">
          <Tab label="Most Liked" {...a11yProps(0)} />
          <Tab label="Most Commented" {...a11yProps(1)} />
          <Tab label="Latest" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {
        mostLikedPosts.length === 0 ? <Box className={classes.emptyBody}>
                                    <Typography>No stories to view...</Typography>
                                    </Box>
                                    : <>
                                    {mostLikedPosts.map((item) => {
                                                            return (
                                                                <Post  key={item['story_id']} post={item} curUser={localStorage.getItem('user_id')}></Post>
                                                            );
                                                            })
                                        }
                                </>
        }
      </TabPanel>
      <TabPanel value={value} index={1}>
       {
        mostCommentedPosts.length === 0 ? <Box className={classes.emptyBody}>
                                    <Typography>No stories to view...</Typography>
                                    </Box>
                                    : <>
                                    {mostCommentedPosts.map((item) => {
                                                        return (
                                                            <Post  key={item['story_id']} post={item} curUser={localStorage.getItem('user_id')}></Post>
                                                        );
                                                        })
                                    }
                                </>
        }
      </TabPanel>
      <TabPanel value={value} index={2}>
        {
        latestPosts.length === 0 ? <Box className={classes.emptyBody}>
                                    <Typography>No stories to view...</Typography>
                                    </Box>
                                    : <>
                                    {latestPosts.map((item) => {
                                                            return (
                                                                <Post  key={item['story_id']} post={item} curUser={localStorage.getItem('user_id')}></Post>
                                                            );
                                                            })
                                        }
                                </>
        }
      </TabPanel>
    </Box>

);
}


export default ExplorePostScroll;