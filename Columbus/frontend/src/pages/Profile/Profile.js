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
import { set } from "date-fns";

function Profile(props) {
  const classes = useStyles();
  //const { userInfo } = props;

  const [loading, setLoading] = useState(false);

  const [curUserId, setCurUserId] = useState(25);
  const [userId, setUserId] = useState(25);
  const [isCurUserFollowing,setIsCurUserFollowing] = useState(false);

  const [profileInfo, setProfileInfo] = useState({
                                                  "first_name": "",
                                                  "last_name": "",
                                                  "birthday": null,
                                                  "location": "",
                                                  "username": "",
                                                  "email": "",
                                                  "followers": [],
                                                  "followings": [],
                                                  "biography": ""
                                              });

  const [sharedPosts, setSharedPosts] = useState(dummyPosts.slice(0,1));
  const [likedPosts, setLikedPosts] = useState(dummyPosts.slice(1,4));
  
  const [tabValue, setTabValue] = useState('shared');

  const [followingsOpen, setFollowingsOpen] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);


  useEffect(() => {

        USER_SERVICE.GET_PROFILEINFO(userId)
    .then((res) => {
      setProfileInfo(res.data.response);
      })
      .catch((error) => {
         console.log(error.response.data.return);
      });
      console.log('profile ', profileInfo)

      if(profileInfo['followings'].includes(curUserId)) {
        setIsCurUserFollowing(true);
      } else {
        setIsCurUserFollowing(false);
      }
    }, [])

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
                          <Button disabled>
                              <Avatar style={{height:70,width:70}}>
                                {profileInfo['first_name'] && profileInfo['last_name'] ? <>{profileInfo['first_name'].slice(0,1) + profileInfo['last_name'].slice(0,1)}
                                                                                            </>
                                                                                        : <></>}
                                </Avatar>
                          </Button>
                         </Box>
                       </Container>
                      
                    </Grid>

                    <Grid item xs>
                         <Stack>
                           {profileInfo['location'] ? <Typography variant="h10">
                                                        <LocationOnIcon color="primary"></LocationOnIcon>
                                                          {profileInfo['location']}
                                                      </Typography>
                                                      : <></>    
                              }
                           {profileInfo['birthday'] ? <Typography variant="h10">
                                                                <CakeIcon color="primary"></CakeIcon>
                                                          {profileInfo['birthday']}
                                                          </Typography> 
                                                      : <></>    
                              }
                          </Stack>
                    </Grid>

                    {curUserId == userId ? 
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
                        title={profileInfo['first_name'] + " " + profileInfo['last_name']}
                        subheader={profileInfo['username']}/>
                    
                    <CardContent>
                        {profileInfo['biography'].length == 0 ? <>
                                                { curUserId == userId ? <>
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
                                                  {profileInfo['biography']}
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
                    <Stack>

                      <Button
                        onClick={handleFollowersDialogOpen}
                        className={classes.buttonText}
                      >
                        {profileInfo['followers'].length}
                        <br />
                        Followers 

                      </Button>
                        <Button 
                        onClick={handleFollowingsDialogOpen}
                        className={classes.buttonText} 
                      >
                        {profileInfo['followings'].length}
                          <br />
                        Followings     
                      </Button>

                    </Stack>
                    </Grid>

                     <Grid item className={classes.followGrid}>
                       {curUserId != userId ? <>
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
                                                          <Post post={item} curUser={curUserId}></Post>
                                                        );
                                                      })
                                          }
                                      </>
                                   :  <>
                                        {likedPosts.map((item) => {
                                                        return (
                                                          <Post post={item} curUser={curUserId}></Post>
                                                        );
                                                      })
                                          }
                                      </> }
            
            

          </Container>
        </Paper>
        <FollowerDialog open={followingsOpen} onClose={handleFollowingsDialogClose} accounts={profileInfo['followings']} title={'Followings'}/>
        <FollowerDialog open={followersOpen}  onClose={handleFollowersDialogClose}  accounts={profileInfo['followers']} title={'Followers'}/>
        <EditProfileDialog  open={editProfileOpen} onClose={handleEditProfileDialogClose} curProfileInfo={profileInfo}></EditProfileDialog>
      </Wrapper>
    </div>
  );
}

export default Profile;




/*

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

*/
