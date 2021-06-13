import React, { useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import {
  Paper,
  Avatar,
  Container,
  Box,
  CircularProgress,
  Typography,
  DialogTitle,
  Dialog,
  makeStyles,
  Link
} from "@material-ui/core";
import PostCard from "../../components/Post";
import api from "../../services/post";
import CreatePostDialog from "../../components/CreatePost/index";
const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  name: {
    flex: 4,
  },
  toolbarSecondary: {
    justifyContent: "flex-end",
    overflowX: "auto",
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
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

function Profile(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [nofFollowers, setNofFollowers] = useState(0);
  const [nofFollowing, setNofFollowing] = useState(0);
  const [OpenDialogFollowing, setOpenDialogFollowing] = React.useState(false);
  const [OpenDialogFollower, setOpenDialogFollower] = React.useState(false);
  const [username, setUsername] = useState("");
  const [following, setFollowing] = useState([]);
  const [follower, setFollower] = useState([]);
  const [postIds, setPostIds] = useState([]);

  const handleClickOpenDialogFollowing = () => {
    setOpenDialogFollowing(true);
  };
  const handleClickOpenDialogFollower = () => {
    setOpenDialogFollower(true);
  };

  const handleCloseDialogFollowing = (value) => {
    setOpenDialogFollowing(false);
  };
  const handleCloseDialogFollower = (value) => {
    setOpenDialogFollower(false);
  };

  useEffect(() => {
    api
      .GET_PROFILE("atainan")
      .then((resp) => {
        setLoading(false);
        setUsername(resp.username);
        setPosts(resp.posts);
        setName(resp.first_name + " " + resp.last_name);
        setNofFollowers(resp.nofFollowers);
        setNofFollowing(resp.nofFollowings);
        setFollowing(resp.followings);
        setFollower(resp.followers);
        setPostIds(resp.postIds);
      })
      .catch((error) => alert(error));
  }, []);

  const renderEmptyPost = () => {
    return (
      <Box className={classes.emptyPost}>
        <Typography>You do not shared story yet!</Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <Wrapper pageTitle="Profile Page">
        <Box className={classes.emptyBody}>
          <CircularProgress />
        </Box>
      </Wrapper>
    );
  }
  return (
    <div>
      <Wrapper pageTitle="Profile Page">
        <Paper
          elevation={3}
          style={{
            width: "100%",
            minHeight: 1090,
            padding: "4%",
            borderRadius: 10,
            marginBottom: 40,
          }}
        >
          <Container style={{ display: "flex", flexDirection: "row" }}>
            <Avatar
              alt="Remy Sharp"
              src="https://i.internethaber.com/storage/files/images/2019/05/08/avatar-2-3-ve-4un-vizyon-tarihle-lna9_cover.jpg"
              elevation={10}
              style={{
                width: 100,
                height: 100,
                marginLeft: 50,
              }}
            />

            <div>
              <Typography
                component="h2"
                variant="h3"
                color="inherit"
                align="center"
                noWrap
                className={classes.toolbarTitle}
                gutterBottom
              >
                {name}
              </Typography>

              <Container style={{ display: "flex", flexDirection: "row" }}>
                <p
                  onClick={handleClickOpenDialogFollowing}
                  style={{ margin: 20, fontSize: 30 }}
                >
                  Following: {nofFollowing}
                </p>
                <Dialog
                  open={OpenDialogFollowing}
                  onClose={handleCloseDialogFollowing}
                  style={{ minWidth: 300, borderRadius: 10 }}
                  aria-labelledby="simple-dialog-title"
                >
                  <DialogTitle
                    id="simple-dialog-title"
                    style={{ minWidth: 300, textAlign: "center" }}
                  >
                    Followings
                  </DialogTitle>
                  {following.map((item, index) => {
                    return (
                      <Link href={`/profile/${item ? item : null}`}>
                        <Container
                          key={index}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            padding: "4%",
                            textAlign: "center",
                          }}
                        >
                          <Avatar
                            alt="r b"
                            src=""
                            elevation={10}
                            style={{
                              width: 40,
                              height: 40,

                              marginRight: "4%",
                            }}
                          >
                            {item.substring(0, 2).toUpperCase()}
                          </Avatar>
                          <h3 style={{ margin: 0, marginTop: "3%" }}>{item}</h3>
                        </Container>
                      </Link>
                    );
                  })}
                  {/* {getFollowing()} */}
                </Dialog>
                <p
                  style={{ margin: 20, fontSize: 30 }}
                  onClick={handleClickOpenDialogFollower}
                >
                  Followers: {nofFollowers}
                </p>
                <Dialog
                  open={OpenDialogFollower}
                  onClose={handleCloseDialogFollower}
                  style={{ minWidth: 300, borderRadius: 10 }}
                >
                  <DialogTitle
                    id="simple-dialog-title"
                    style={{ minWidth: 300, textAlign: "center" }}
                  >
                    Followings
                  </DialogTitle>
                  {follower.map((item, index) => {
                    return (
                      <Link href={`/profile/${item ? item : null}`}>
                        <Container
                          key={index}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            padding: "4%",
                            textAlign: "center",
                          }}
                        >
                          <Avatar
                            alt="r b"
                            src=""
                            elevation={10}
                            style={{
                              width: 40,
                              height: 40,

                              marginRight: "4%",
                            }}
                          >
                            {item.substring(0, 2).toUpperCase()}
                          </Avatar>
                          <h3 style={{ margin: 0, marginTop: "3%" }}>{item}</h3>
                        </Container>
                      </Link>
                    );
                  })}
                  {/* {getFollowing()} */}
                </Dialog>
              </Container>
            </div>
          </Container>
          <CreatePostDialog></CreatePostDialog>
          {postIds.length === 0 && renderEmptyPost()}
          {postIds.length !== 0 &&
            postIds.map((item, index) => {
              return <PostCard key={index} props={{ id: item }}></PostCard>;
            })}
        </Paper>
      </Wrapper>
    </div>
  );
}

export default Profile;
