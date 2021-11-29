import React, { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom'

import { makeStyles, Box, CircularProgress, Typography } from "@material-ui/core";

//import api from "../../services/post";
import Wrapper from "../../components/Wrapper/Wrapper";
import Post from "../../components/Post/Post";
import InfiniteScroll from 'react-infinite-scroll-component';

import {dummyPosts} from './Home.constants.js';


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

function Home() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
    
  const fetchData = () => {
    if (posts.length === dummyPosts.length) {
        setHasMore(false);
        return;
    }
    setTimeout(() => {
                      setPosts(dummyPosts.slice(0,posts.length+2));
                      }, 600);
  };

  useEffect(() => {
      setLoading(false);
      setPosts(dummyPosts.slice(0,2));   
      document.title="Columbus"
  }, []);


  if (loading) {
    return (
      <Wrapper>
        <Box className={classes.emptyBody}>
          {'Loading...'}
          <CircularProgress />
        </Box>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {
      posts.length === 0 ? <Box className={classes.emptyBody}>
                              <Typography>You do not have any stories to view.</Typography>
                              <NavLink to="/Home">Explore Stories</NavLink> 
                          </Box>
                        : <InfiniteScroll
                              dataLength={posts.length} // ? 20
                              next={fetchData}
                              hasMore={hasMore}
                              loader={<h4>Loading...</h4>}
                              endMessage={
                                          <p style={{ textAlign: 'center' }}>
                                            <b>You have seen all of your stories!</b>
                                          </p>
                                          } 
                              >
                              {posts.map((item) => {
                                                      return (
                                                        <Post post={item} curUser={"Salih Yılmaz"}></Post>
                                                      );
                                                    })
                                }
                            </InfiniteScroll>
      }
    </Wrapper>
);
}

export default Home;
