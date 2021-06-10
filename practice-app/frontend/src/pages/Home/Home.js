import React, { useEffect, useState } from "react";
import {
  Box,
  makeStyles,
  CircularProgress,
  Typography,
} from "@material-ui/core";

import api from "../../services/post";
import Wrapper from "../../components/Wrapper/Wrapper";
import PostCard from "../../components/Post";

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

  useEffect(() => {
    api
      .GET_POSTS("atainan")
      .then((resp) => {
        setLoading(false);
        setPosts(resp.posts);
      })
      .catch((error) => alert(error));
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
          <CircularProgress />
        </Box>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Box className={classes.body}>
        {posts.length === 0 && renderEmptyPost()}
        {posts.length !== 0 &&
          posts.map((item, index) => {
            return <PostCard key={index} props={{ id: item.id }}></PostCard>;
          })}
      </Box>
    </Wrapper>
  );
}

export default Home;
