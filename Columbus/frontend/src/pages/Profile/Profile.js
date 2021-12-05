import React, { useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import {
  Paper,
  Avatar,
  Container,
  Grid,
  Box,
  CircularProgress,
  Typography,
  DialogTitle,
  Dialog,
  makeStyles,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Divider
} from "@material-ui/core";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import Post from "../../components/Post/Post";
import api from "../../services/post";
import CreatePostDialog from "../../components/CreatePost/index";
import {dummyPosts} from "../Home/Home.constants"
import { shadows } from '@mui/system';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

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
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("Salih Yilmaz");
  const [nofFollowers, setNofFollowers] = useState(3);
  const [nofFollowing, setNofFollowing] = useState(3);
  const [OpenDialogFollowing, setOpenDialogFollowing] = React.useState(false);
  const [OpenDialogFollower, setOpenDialogFollower] = React.useState(false);
  const [username, setUsername] = useState("");
  const [following, setFollowing] = useState([]);
  const [follower, setFollower] = useState([]);
  const [postIds, setPostIds] = useState([]);
  
  const [value, setValue] = React.useState('one');


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

  const renderEmptyPost = () => {
    return (
      <Box className={classes.emptyPost}>
        <Typography>You do not shared story yet!</Typography>
      </Box>
    );
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
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
    <div>
      <Wrapper>
        <Paper
          elevation={1}
          style={{
            width: "98%",
            minHeight: 1090,
            padding: "4%",
            margin: "1%",
            borderRadius: 0,
          }}
        >
       

          <Container fixed>
            <Box sx={{ height: '50vh', boxShadow: 3  }}>

              <Grid xs container direction="column" spacing={6}>

                <Grid item container spacing={5}>

                  <Grid item container direction="column" xs={2} spacing={2}>
                    
                    <Grid item xs >
                      <Button sx={{ height: '100', width: '100' }}>
                        <Avatar >S</Avatar>
                      </Button>
                    </Grid>

                    <Grid item xs>
                         <Stack>
                          <Button 
                            size="medium"
                            variant="text"
                            startIcon={ <LocationOnIcon color="primary"></LocationOnIcon>}
                            style={{textTransform: 'none'}} 
                            >
                              Ankara
                            </Button>
                          <Button 
                            size="medium"
                            variant="text"
                            startIcon={ <CakeIcon color="primary"></CakeIcon>}
                            >
                              01.01.1960
                            </Button>
                          </Stack>
                    </Grid>

                    <Grid item xs>
                          <Button 
                            color="primary" 
                            variant="contained"
                            style={{textTransform: 'none'}} 
                            >
                              Edit Profile
                          </Button>
                    </Grid>

                  </Grid>

                  <Grid item xs={8} sm>

                        <Typography gutterBottom variant="h5" component="div">
                          Salih Yılmaz
                        </Typography>
                        <Typography variant="h7" gutterBottom>
                          salihyilmaz
                        </Typography>
                        <Typography variant="h6" color="primary">
                          About Me
                        </Typography>
                        <Typography variant="body2">
                          I am a retired railroad officer. It was always a pleasure for me to share my memories with other people. Here, you can find many of them!.
                          <br />
                          {'- An Old Story Teller'}
                        </Typography>

                  </Grid>

                  <Grid item xs={2}>
                    <Stack>
                      <Button
                        onClick={handleClickOpenDialogFollowing}
                      >
                        Following: {nofFollowing}
                      </Button>
                
                      <Button
                        onClick={handleClickOpenDialogFollower}
                      >
                        Followers: {nofFollowers}
                      </Button>
                    </Stack>
                  </Grid>

              </Grid>

              <Grid item>


                <Grid item xs= {12}>
                    <Box sx={{ width: '100%' }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      textColor="primary"
                      indicatorColor="primary"
                      aria-label="secondary tabs example"
                    >
                      <Tab value="one" label="Shared Stories" />
                      <Tab value="two" label="Liked Stories" />
                    </Tabs>
                  </Box>
                </Grid>

              </Grid>
              
              </Grid>

                
            </Box>


          </Container>
        </Paper>

      </Wrapper>
    </div>
  );
}

export default Profile;





/*


          <Container style={{ display: "flex", flexDirection: "column" }}>
       
            <Container style={{ display: "flex", flexDirection: "row" }}>
              
          <Card sx={{ minWidth: 275,display: 'flex'}} variant="outlined">
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardMedia>
                      <Avatar
                  alt="Remy Sharp"
                  elevation={1}
                >
                  S
                </Avatar>
                  </CardMedia>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
               {name}
              </Typography>
              <Typography variant="h5" component="div">
                About Me
              </Typography>
              <Typography variant="body2">
                I am a retired railroad officer. It was always a pleasure for me to share my memories with other people. Here, you can find many of them!.
                <br />
                {'"a benevolent smile"'}
              </Typography>
            </CardContent>
              </Box>
          </Card>

              </Container>
              <Container style={{ display: "flex", flexDirection: "row" }}>
                <Button
                  onClick={handleClickOpenDialogFollowing}
                  style={{ margin: 10, fontSize: 15 }}
                >
                  Following: {nofFollowing}
                </Button>
                
                <Button
                  style={{ margin: 10, fontSize: 15 }}
                  onClick={handleClickOpenDialogFollower}
                >
                  Followers: {nofFollowers}
                </Button>

              </Container>
          </Container>

          <Button color="primary" variant="contained">Edit Profile</Button>
          <Divider/>
          {dummyPosts.length === 0 && renderEmptyPost()}
          {dummyPosts.length !== 0 &&
            dummyPosts.map((item) => {
              return  <Post post={item} curUser={"Salih Yılmaz"}></Post>;
            })}



*/



/*

        >
          <Container fixed>

            <Box sx={{ bgcolor: '#cfe8fc', height: '50vh' }} />

            <Box sx={{ bgcolor: '#cfe8fc', height: '50vh' }} />

          </Container>


*/