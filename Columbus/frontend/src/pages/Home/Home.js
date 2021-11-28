import React, { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom'

import { Box, makeStyles, CircularProgress, Typography } from "@material-ui/core";

import api from "../../services/post";
import Wrapper from "../../components/Wrapper/Wrapper";
import Post from "../../components/Post/Post";
import InfiniteScroll from 'react-infinite-scroll-component';

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


   const post1 = {owner_username : 'dogusuyan', 
                  story:'I went to Boun until I got crazy... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin et eleifend erat. Integer nec arcu in ex cursus laoreet non et turpis. Pellentesque tellus turpis, aliquet at dui sed, dignissim vestibulum elit. In malesuada tempus lectus nec viverra. Ut non justo ut leo eleifend finibus ac nec est. Quisque pharetra libero ac orci ullamcorper condimentum. Quisque vehicula rutrum sem at pellentesque. Sed eu sagittis felis, et consectetur magna. Duis sit amet lacus euismod risus cursus feugiat vel eget lacus. Cras vulputate diam metus, a consectetur neque placerat eget. Nullam at urna et nulla facilisis semper. Nunc sed varius mauris. Aenean hendrerit sodales blandit. Cras euismod aliquet sem, vel accumsan dolor iaculis in. Etiam ac consectetur orci. Pellentesque tincidunt quam tellus, ac condimentum nisl commodo vitae. Integer commodo ante in mollis scelerisque. Nulla turpis est, tempor vitae ante a, posuere accumsan lectus. Praesent quis hendrerit ligula.',
                  start: '01.01.1999', 
                  end: '01.02.1999',
                  title: 'A Story about Craziness',
                  tags: ['summer','lifelong','learning'],
                  multimedia: ['https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'https://images.pexels.com/photos/3747505/pexels-photo-3747505.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940']   
                  }
   const post2 = {owner_username : 'tarkankuzu', 
                  story:'I love Haydarpasa Cat. Etiam volutpat ornare arcu, eu tincidunt massa auctor et. Pellentesque a congue diam, eu euismod eros. Quisque felis massa, posuere ultricies eros ut, scelerisque aliquam tortor. Pellentesque et hendrerit nunc.  Morbi est ipsum, viverra a ullamcorper quis, tempor quis sem.',
                  start: '01.01.1999', 
                  end: '01.02.1999',
                  title: 'Cats are Amazing',
                  tags: ['cat','love','terminal'],
                  multimedia: ['https://images.pexels.com/photos/8264394/pexels-photo-8264394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940']   
                  }
    const post3 = {owner_username : 'tarkankuzu', 
                  story:'I love Haydarpasa Cat. Etiam volutpat ornare arcu, eu tincidunt massa auctor et. Pellentesque a congue diam, eu euismod eros. Quisque felis massa, posuere ultricies eros ut, scelerisque aliquam tortor. Pellentesque et hendrerit nunc.  Morbi est ipsum, viverra a ullamcorper quis, tempor quis sem.',
                  start: '01.01.1999', 
                  end: '01.02.1999',
                  title: 'Cats are Amazing',
                  tags: ['cat','love','terminal'],
                  multimedia: ['https://images.pexels.com/photos/8264394/pexels-photo-8264394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940']   
                  }
    const post4 = {owner_username : 'tarkankuzu', 
                  story:'I love Haydarpasa Cat. Etiam volutpat ornare arcu, eu tincidunt massa auctor et. Pellentesque a congue diam, eu euismod eros. Quisque felis massa, posuere ultricies eros ut, scelerisque aliquam tortor. Pellentesque et hendrerit nunc.  Morbi est ipsum, viverra a ullamcorper quis, tempor quis sem.',
                  start: '01.01.1999', 
                  end: '01.02.1999',
                  title: 'Cats are Amazing',
                  tags: ['cat','love','terminal'],
                  multimedia: ['https://images.pexels.com/photos/8264394/pexels-photo-8264394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940']   
                  }
    const dummyPosts = [post1,post2,post3,post4] // [] 

function Home() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
    
  const fetchData = () => {

    if (posts.length == dummyPosts.length) {
        setHasMore(false);
        return;
    }

    setTimeout(() => {
    setPosts(dummyPosts.slice(0,posts.length+2));
      }, 600);
  };
                  /*
  useEffect(() => {
    api
      .GET_POSTS("atainan")
      .then((resp) => {
        setLoading(false);
        setPosts(resp.posts);
      })
      .catch((error) => alert(error));
  }, []);
  */

  useEffect(() => {
        setLoading(false);
        setPosts(dummyPosts.slice(0,2));   //[post1,post2]);
        document.title="Columbus"
  }, []);

  const renderEmptyPost = () => {
    return (
      <Box className={classes.emptyPost}>
        <Typography>There is not any story yet!</Typography>
      </Box>
    );
  };

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
      posts.length == 0 ? <Box className={classes.emptyBody}>
                              <Typography>You do not have any stories to view.</Typography>
                              <NavLink to="/Home">Explore Stories</NavLink> 
                          </Box>
                        : <InfiniteScroll
                              dataLength={posts.length} // 20
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
