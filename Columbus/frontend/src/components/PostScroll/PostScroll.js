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


function PostScroll(props) {

  const classes = useStyles();
  
  const { username, type } = props;
  const [curPosts, setCurrentPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  const [hasMore, setHasMore] = useState(true);

  const fetchData = () => {

    if (curPosts.length === 0) {
        setHasMore(false);
        return;
    }
    setTimeout(() => {
                     USER_SERVICE.GET_PROFILEPOSTS(username,pageNumber,5)
                                            .then((res) => {
                                                setCurrentPosts(res.data['return'])
                                            })
                                            .catch((error) => {
                                                console.log(error)
                                            });
                      }, 500);
    setPageNumber(pageNumber+1);
  };

  return (<>
      {
      curPosts.length === 0 ? <Box className={classes.emptyBody}>
                                <Typography>You do not have any stories to view.</Typography>
                              <NavLink to="/Home">Explore Stories</NavLink> 
                          </Box>
                        : <InfiniteScroll
                              dataLength={curPosts.length} // ? 20
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
</>
);
}


export default PostScroll;