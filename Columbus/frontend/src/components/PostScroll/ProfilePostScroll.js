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


function ProfilePostScroll({ userToBeViewed, userThatViews, ...props}) {

  const classes = useStyles();
  
  const [curPosts, setCurrentPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  //const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
     USER_SERVICE.GET_PROFILEPOSTS(userToBeViewed,pageNumber,20)
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
                                <Typography>You do not have any stories to view.</Typography>
                              <NavLink to="/Home">Explore Stories</NavLink> 
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


/*

{
      curPosts.length === 0 ? <Box className={classes.emptyBody}>
                                <Typography>You do not have any stories to view.</Typography>
                              <NavLink to="/Home">Explore Stories</NavLink> 
                          </Box>
                        : <InfiniteScroll
                              dataLength={20} // ? 20
                              next={fetchData}
                              hasMore={hasMore}
                              loader={<h4>Loading...</h4>}
                              endMessage={
                                          <p style={{ textAlign: 'center' }}>
                                            <b>You have seen all of your stories!</b>
                                          </p>
                                          } 
                              >
                              {curPosts.map((item) => {
                                                      return (
                                                        <Post post={item} curUser={userThatViews}></Post>
                                                      );
                                                    })
                                }
                            </InfiniteScroll>
      }


*/

    /*
  var fetchData = () => {

    console.log('hereee ')
    USER_SERVICE.GET_PROFILEPOSTS(userToBeViewed,pageNumber,5)
                                            .then((res) => {
                                                if (res.data['return'].length === 0) {
                                                      setHasMore(false);
                                                      return;
                                                  }
                                                setCurrentPosts(curPosts.concat(res.data['return']))
                                                setIsLoading(false);
                                                console.log('return ', res.data['return'])
                                            })
                                            .catch((error) => {
                                                console.log(error)
                 });
                      
    setPageNumber(pageNumber+1);
  };*/