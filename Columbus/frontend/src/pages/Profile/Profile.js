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

import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
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

  const [curUser, setCurUser] = useState("dogusuyan")

  const [firstName, setFirstName] = useState("Salih");
  const [lastName, setLastName] = useState("Yilmaz");
  const [username, setUsername] = useState("salihyilmaz");
  const [email, setEmail] = useState("yilmazsalih@gmail.com");
  const [aboutMe, setAboutMe] = useState("I am a retired railroad officer. It was always a pleasure for me to share my memories with other people. Here, you can find many of them!.\n - An Old Story Teller"); // 

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

  const [isCurUserFollowing,setIsCurUserFollowing] = useState(false);

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


  const handleFollow = (value) => {
    setIsCurUserFollowing(true);
    // call follow API
  };
    const handleUnfollow = (value) => {
    setIsCurUserFollowing(false);
    // call unfollow API
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
                        <Container>
                         <Box sx={{width:"100%"}}>
                          <Button disable>
                              <Avatar style={{height:70,width:70}}>S</Avatar>
                          </Button>
                         </Box>
                       </Container>
                      
                    </Grid>

                    <Grid item xs>
                         <Stack>
                          <Button 
                            size="medium"
                            variant="text"
                            startIcon={ <LocationOnIcon color="primary"></LocationOnIcon>}
                            className={classes.buttonText}
                            disabled
                            >
                              Ankara
                            </Button>
                          <Button 
                            size="medium"
                            variant="text"
                            startIcon={ <CakeIcon color="primary"></CakeIcon>}
                            disabled
                            >
                              01.01.1960
                            </Button>
                          </Stack>
                    </Grid>

                    {curUser === username ? 
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
                                          :
                                          <></>
                    }
                  </Grid>

                  <Grid item xs={7} sm>


                    <Card  variant="elevation">
                      <CardHeader 
                        title={firstName + " " + lastName}
                        subheader="salihyilmaz"/>
                    
                    <CardContent>
                        {aboutMe.length == 0 ? <>
                                                { curUser == username ? <>
                                                                          <Typography variant="h6" color="primary">
                                                                            About Me
                                                                          </Typography>
                                                                          <Button
                                                                            className={classes.buttonText} 
                                                                            onClick={handleEditProfileDialogOpen}>
                                                                            Add biography to introduce yourself to others!
                                                                          </Button>
                                                                        </>
                                                                        :
                                                                        <></>
                                                  
                                                  }
                                                </>
                                            : <>
                                                <Typography variant="h6" color="primary">
                                                  About Me
                                                </Typography>
                                                <Typography variant="body2">
                                                  {aboutMe}
                                                </Typography>
                                              </>
                                                
                      
                      }
                        
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item container xs={2}>
                     <Grid item>
                       <Container>
                         <Box sx={{width:"100%"}}></Box>
                       </Container>
                       </Grid>
                    <Grid item>
                    <Stack >

                      <Button
                        onClick={handleFollowersDialogOpen}
                        className={classes.buttonText}
                      >
                        {nofFollowers}
                        <br />
                        Followers 

                      </Button>
                        <Button 
                        onClick={handleFollowingsDialogOpen}
                        className={classes.buttonText} 
                      >
                        {nofFollowing}
                          <br />
                        Followings     
                      </Button>

                    </Stack>
                    </Grid>

                     <Grid item className={classes.followGrid}>
                       {curUser != username ? <>
                                              { isCurUserFollowing ?
                                                                      <Button 
                                                                        color="primary" 
                                                                        variant="outlined"
                                                                        onClick={handleUnfollow}
                                                                        className={classes.buttonText} 
                                                                        startIcon={ <PersonRemoveIcon/>}
                                                                        style={{width:'92px'}}
                                                                      >
                                                                        Unfollow 
                                                                      </Button>
                                                                    :
                                                                      <Button 
                                                                      color="primary" 
                                                                      variant="outlined"
                                                                      onClick={handleFollow}
                                                                      className={classes.buttonText} 
                                                                      startIcon={ <PersonAddAlt1Icon/>}
                                                                      style={{width:'92px'}}
                                                                  >
                                                                    Follow 
                                                                  </Button>
                                                  } </> 
                                            :
                                            <></>
                        }
                      </Grid>
                   
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
        <EditProfileDialog  open={editProfileOpen} onClose={handleEditProfileDialogClose} curProfileInfo={{'username':username,'firstName': firstName,'lastName':lastName,'email':email, 'aboutMe':aboutMe}}></EditProfileDialog>
      </Wrapper>
    </div>
  );
}

export default Profile;