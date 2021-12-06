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
  Button,
  Card,
  CardHeader,
  CardContent,
  Divider
} from "@material-ui/core";


import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import Post from "../../components/Post/Post";
import api from "../../services/post";
import {dummyPosts} from "../Home/Home.constants"
import {useStyles} from "./Profile.styles"

import FollowerDialog from "../../components/Dialogs/FollowerDialog/FollowerDialog"
import EditProfileDialog from "../../components/Dialogs/EditProfileDialog/EditProfileDialog"

import USER_SERVICE from "../../services/user";

function Profile(props) {
  const classes = useStyles();
  //const { userInfo } = props;

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("Salih Yilmaz");
  const [username, setUsername] = useState("salihyilmaz");

  const [following, setFollowing] = useState(['dogusuyan','tarkankuzu','barinrabia']);
  const [follower, setFollower] = useState(['dogusuyan','tarkankuzu','barinrabia','haydarpasacat']);
  const [nofFollowers, setNofFollowers] = useState(follower.length);
  const [nofFollowing, setNofFollowing] = useState(following.length);

  const [sharedPosts, setSharedPosts] = useState(dummyPosts.slice(0,1));
  const [likedPosts, setLikedPosts] = useState(dummyPosts.slice(1,4));
  
  const [tabValue, setTabValue] = useState('shared');

  const [followingsOpen, setFollowingsOpen] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  /*
  useEffect(() => {
        USER_SERVICE.GET_PROFILE(username)
    .then((res) => {
          setOpenRegister(true);
      })
      .catch((error) => {
        setMessage(error.response.data.return);
      })
    }, [])*/

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFollowingsDialogOpen = () => {
    setFollowingsOpen(true);
  };
  const handleFollowersDialogOpen = () => {
    setFollowersOpen(true);
  };

  const handleEditProfileDialogOpen = () => {
    setEditProfileOpen(true);
  };

  const handleFollowingsDialogClose = (value) => {
    setFollowingsOpen(false);
  };

 const handleFollowersDialogClose = (value) => {
    setFollowersOpen(false);
  };

  const  handleEditProfileDialogClose = (value) => {
    setEditProfileOpen(false);
  };

  const renderEmptyPost = () => {
    return (
      <Box className={classes.emptyPost}>
        <Typography>You do not shared story yet!</Typography>
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
    <div>
      <Wrapper>
        <Paper
          elevation={1}
          className={classes.profilePaper}
        >

          <Container fixed>
            <Box className={classes.profileInfo}>

              <Grid xs container direction="column" spacing={6}>

                <Grid item container spacing={5}>

                  <Grid item container direction="column" xs={3} spacing={2}>
                    
                    <Grid item xs >
                      <Button size="large">
                        <Avatar >S</Avatar>
                      </Button>
                    </Grid>

                    <Grid item xs>
                         <Stack>
                          <Button 
                            size="medium"
                            variant="text"
                            startIcon={ <LocationOnIcon color="primary"></LocationOnIcon>}
                            className={classes.buttonText}
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
                            className={classes.buttonText} 
                            onClick={handleEditProfileDialogOpen}
                            >
                              Edit Profile
                          </Button>
                    </Grid>

                  </Grid>

                  <Grid item xs={7} sm>


                    <Card  variant="elevation">
                      <CardHeader 
                        title={name}
                        subheader="salihyilmaz"/>
                    
                    <CardContent>
                        <Typography variant="h6" color="primary">
                          About Me
                        </Typography>
                        <Typography variant="body2">
                          I am a retired railroad officer. It was always a pleasure for me to share my memories with other people. Here, you can find many of them!.
                          <br />
                          {'- An Old Story Teller'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={2}>
                    <Stack>
                      <Button 
                        onClick={handleFollowingsDialogOpen}
                        className={classes.buttonText} 
                      >
                        Following  
                          <br />
                          {nofFollowing}
                      </Button>
                
                      <Button
                        onClick={handleFollowersDialogOpen}
                        className={classes.buttonText}
                      >
                        Followers 
                        <br />
                        {nofFollowers}
                      </Button>
                    </Stack>
                   
                  </Grid>

              </Grid>

              <Grid container>

                <Grid item xs= {5}>
 
                    <Box width="100%"/>


                </Grid>
                <Grid item xs= {7}>
                     

                     <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      textColor="primary"
                      indicatorColor="primary"
                      aria-label="secondary tabs example"
                    >
                      <Tab value="shared" label="Shared Stories" />
                      <Tab value="liked" label="Liked Stories" />
                    </Tabs>
                </Grid>
                <Grid item xs= {2}>
                           <Box width="100%"/>
                    </Grid>
                

              </Grid>
              
              </Grid>

                
            </Box>


          </Container>
          
          <Container>
            {tabValue === "shared" ? <>
                                        {sharedPosts.map((item) => {
                                                        return (
                                                          <Post post={item} curUser={username}></Post>
                                                        );
                                                      })
                                          }
                                      </>
                                   :  <>
                                        {likedPosts.map((item) => {
                                                        return (
                                                          <Post post={item} curUser={username}></Post>
                                                        );
                                                      })
                                          }
                                      </> }
            
            

          </Container>
        </Paper>
        <FollowerDialog open={followingsOpen} onClose={handleFollowingsDialogClose} accounts={following} title={'Followings'}/>
        <FollowerDialog open={followersOpen}  onClose={handleFollowersDialogClose}  accounts={follower} title={'Followers'}/>
        <EditProfileDialog  open={editProfileOpen} onClose={handleEditProfileDialogClose}></EditProfileDialog>
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

      <Grid item xs={7} sm
                        sx={{

                              display: "flex",
                              alignItems: "center",
                               justifyContent: "flex-end"
                              }}
                        >
                        <Typography gutterBottom variant="h5">
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


*/