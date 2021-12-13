import React, { useState, useEffect } from "react";

import { makeStyles, Box, CircularProgress, Typography } from "@material-ui/core";
import { NavLink } from 'react-router-dom'

//import InfiniteScroll from 'react-infinite-scroll-component';

import Post from '../Post/Post'
import USER_SERVICE from "../../services/user";
import GUEST_SERVICE from "../../services/guest";

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


function HomePostScroll({ isAuthenticated, curUser }) {

  const classes = useStyles();
  
  const [curPosts, setCurrentPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  //const [hasMore, setHasMore] = useState(true);

  useEffect(() => {

    console.log('isauth ', isAuthenticated)

    if(isAuthenticated) {
     USER_SERVICE.GET_HOMEPOSTS(curUser,pageNumber,20)
                                            .then((res) => {
                                              setCurrentPosts(res.data.return.slice(0,5))
                                              setIsLoading(false);
                                              console.log('user home posts ', res.data.return)
                                            })
                                            .catch((error) => {
                                                console.log(error)
                 });

    } else {
    GUEST_SERVICE.GET_HOMEPOSTS(pageNumber,20)
                                            .then((res) => {
                                              
                                              setCurrentPosts(res.data.return.slice(0,3))
                                              console.log('isauth ', isAuthenticated)
                                              console.log(' gusest home posts ', res.data.return)
                                              setIsLoading(false);
                                            })
                                            .catch((error) => {
                                                console.log(error)
                 });
    }
    }, []);

   
  if(isLoading) {
    return <CircularProgress color="success" />
  }
  return (<>
  {
      curPosts.length === 0 ? <Box className={classes.emptyBody}>
                                <Typography>You do not have any stories to view.</Typography>
                              <NavLink to="/Home">Explore Stories</NavLink> 
                          </Box>
                        : <>
                              {curPosts.map((item) => {
                                                      return (
                                                        <Post  key={item['story_id']} post={item} curUser={curUser}></Post>
                                                      );
                                                    })
                                }
                            </>
      }
      
</>
);
}


export default HomePostScroll;