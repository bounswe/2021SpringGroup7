import React, { useState, useEffect } from "react";

import { makeStyles, Box, CircularProgress, Typography } from "@material-ui/core";
import { NavLink } from 'react-router-dom'

import InfiniteScroll from 'react-infinite-scroll-component';

import Post from '../Post/Post'
import USER_SERVICE from "../../services/user";

const useStyles = makeStyles((theme) => ({
  body: {
    display: "flex",
    flexDirection: "column",
    minHeight: 680,
    backgroundColor: "#dddcd0",
  },
  emptyBody: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 680,
    backgroundColor: "white",
  },
  emptyPost: {
    marginTop: 16,
  },
}));


function ProfilePostScroll({ userToBeViewed, userThatViews,...props}) {

  const classes = useStyles();
  
  const [curPosts, setCurrentPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  //const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
   
     USER_SERVICE.GET_PROFILEPOSTS(userToBeViewed,pageNumber,150)
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
  return (<>
  {
      curPosts.length === 0 ? <Box className={classes.emptyBody}>
                                {userThatViews === userToBeViewed ?
                                              <Typography>You have not shared any stories yet.</Typography>
                                                                  :
                                               <Typography>This user has not shared any stories yet.</Typography>       
                                 }
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


export default ProfilePostScroll;
