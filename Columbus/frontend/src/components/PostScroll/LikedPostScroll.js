import React, { useState, useEffect } from "react";

import { makeStyles, Box, CircularProgress, Typography } from "@material-ui/core";
import { NavLink } from 'react-router-dom'

import Post from '../Post/Post'
import USER_SERVICE from "../../services/user";

import { useStyles } from './PostScroll.styles'


function LikedPostScroll({ userToBeViewed, userThatViews, isShown }) {

  const classes = useStyles();
  
  const [curPosts, setCurrentPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

      USER_SERVICE.GET_LIKEDPOSTS(userToBeViewed,pageNumber,20)
                                            .then((res) => {
                                              setCurrentPosts(res.data.return)
                                              setIsLoading(false);
                                            })
                                            .catch((error) => {
                                                console.log(error)
                 });

    }, []);

   
  if(isLoading) {
    return <CircularProgress color="success" />
  }

  if(!isShown) {

    return (<>
              <Box className={classes.emptyBody}>
                <Typography>This is a private account and you have to follow to view user stories!</Typography>
              </Box>
              </>)

  }


  return (<>
  {
      curPosts.length === 0 ? <Box className={classes.emptyBody}>
                                <Typography>You have not liked any stories yet.</Typography>
                          </Box>
                        : <>
                              {curPosts.map((item) => {
                                                      return (
                                                        <Post key={item['story_id']} post={item} curUser={userThatViews}></Post>
                                                      );
                                                    })
                                }
                            </>
      }
      
</>
);
}


export default LikedPostScroll;


