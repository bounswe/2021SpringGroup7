import React, { useState, useEffect } from "react";

import { makeStyles, Box, CircularProgress, Typography } from "@material-ui/core";
import { NavLink } from 'react-router-dom'

import InfiniteScroll from 'react-infinite-scroll-component';

import Post from '../Post'
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


function PostScroll({username,...props}) {

  const classes = useStyles();
  
  //const { username } = props;
  const [curPosts, setCurrentPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [hasMore, setHasMore] = useState(true);


 /*
  useEffect(() => {

     USER_SERVICE.GET_PROFILEPOSTS(username,pageNumber,5)
                                            .then((res) => {
                                                setCurrentPosts(curPosts.concat(res.data['return']))
                                                setIsLoading(false);
                                                console.log('return ', res.data['return'])
                                            })
                                            .catch((error) => {
                                                console.log(error)
                 });
    }, []);*/
  
  var fetchData = () => {

    USER_SERVICE.GET_PROFILEPOSTS(username,pageNumber,5)
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
  };

  if(isLoading) {
    <CircularProgress color="success" />
  }
  return (<>
  <InfiniteScroll
                              dataLength={curPosts.length} // ? 20
                              next={fetchData}
                              hasMore={true}
                              loader={<CircularProgress color="success" />}
                              endMessage={
                                          <p style={{ textAlign: 'center' }}>
                                            <b>You have seen all of your stories!</b>
                                          </p>
                                          } 
                              >
                              {curPosts.map((item) => {
                                                      return (
                                                        <Post post={item} curUser={username}></Post>
                                                      );
                                                    })
                                }
                            </InfiniteScroll>
      
</>
);
}


export default PostScroll;


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
                                                        <Post post={item} curUser={username}></Post>
                                                      );
                                                    })
                                }
                            </InfiniteScroll>
      }


*/