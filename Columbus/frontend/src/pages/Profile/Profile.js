import React, { useEffect, useState } from "react";
import { useNavigate, useParams  } from "react-router-dom";
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
  IconButton
} from "@material-ui/core";

import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Post from "../../components/Post/Post";
import SettingsIcon from '@material-ui/icons/Settings';

import {dummyPosts} from "../Home/Home.constants"
import {useStyles} from "./Profile.styles"

import FollowerDialog from "../../components/Dialogs/FollowerDialog/FollowerDialog"
import EditProfileDialog from "../../components/Dialogs/EditProfileDialog/EditProfileDialog"
import FollowUnfollow from "./Profile.follow"
import ProfilePostScroll from "../../components/PostScroll/ProfilePostScroll"
import LikedPostScroll from "../../components/PostScroll/LikedPostScroll"
import VerticalMenu from "./VerticalMenu";

import USER_SERVICE from "../../services/user";
import SettingsDialog from "../../components/Dialogs/SettingsDialog/SettingsDialog"


// takes yyyy-mm-dd, returns dd mm, yyyy
function convertBirthday(birthday) {

  let birthdayReadable = ''
  if(!!birthday) {
  birthdayReadable = new Date(Date.UTC(
                            parseInt(birthday.substring(0,4)),
                            parseInt(birthday.substring(5,7))-1, 
                            parseInt(birthday.substring(8,10)), 
                                      3, 0, 0))
                          .toLocaleDateString('en-US',{ year: "numeric", month: "long", day: "numeric" })
  }

  return birthdayReadable

}
module.exports = convertBirthday;

function Profile({...props}) {
  const navigate = useNavigate();
  let { userId } = useParams();                     // viewing this user's profile
  if(!userId) {

    userId = localStorage.getItem('userid');
  }
  const classes = useStyles();
  const curUserId = localStorage.getItem('userid');    // user in current session
                   

  const [loading, setLoading] = useState(true);
  const [isAbleToView,setIsAbleToView] = useState(false);

                    
  const [isCurUserFollowing,setIsCurUserFollowing] = useState([]);
  const [isFollowClicked,setIsFollowClicked] = useState([]);

  const [profileInfo, setProfileInfo] = useState({
                                                  "first_name": "",
                                                  "last_name": "",
                                                  "birthday": null,
                                                  "username": "",
                                                  "photo_url": "",
                                                  "email": "",
                                                  "followers": [],
                                                  "followings": [],
                                                  "biography": "",
                                                  "public": true
                                              });

  const [isBlocked, setIsBlocked] = useState(false);
  
  const [tabValue, setTabValue] = useState('shared');
  const [infoLoading, setInfoLoading] = useState(true);

  const [followingsOpen, setFollowingsOpen] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [verticalMenuOpen, setVerticalMenuOpen] = useState(false);


  useEffect(() => {

    setLoading(true);

     USER_SERVICE.GET_PROFILEINFO(userId)
      .then((res) => {
        const proInfo = res.data.response;
        console.log('profile info ', proInfo)
        if(proInfo['followers']){                                   // user in session is able to view this profile
          setProfileInfo({
                            "first_name": proInfo['first_name'],
                            "last_name" : proInfo['last_name'],
                            "birthday"  : proInfo['birthday'],
                            "photo_url" : proInfo['photo_url'],
                            "username"  : proInfo['username'],
                            "email"     : proInfo['email'],
                            "followers" : proInfo['followers'],
                            "followings": proInfo['followings'],
                            "biography" : proInfo['biography'],
                            "public"    : proInfo['public']
                          }
          ); 
          setIsAbleToView(true);

          
          if(res.data.response['followers'].some(follower => follower['user_id'].toString() === curUserId)) 
          {
            setIsCurUserFollowing(true);
          } else {
            setIsCurUserFollowing(false);
          }

        } else {
          setProfileInfo({
                            "first_name": proInfo['first_name'],
                            "last_name" : proInfo['last_name'],
                            "birthday"  : proInfo['birthday'],
                            "photo_url" : proInfo['photo_url'],
                            "username"  : proInfo['username'],
                            "email"     : proInfo['email'],
                            "followers_count" : proInfo['followers_count'],
                            "followings_count": proInfo['followings_count'],
                            "biography" : proInfo['biography'],
                            "public"    : proInfo['public']
                          }
          ); 
          setIsCurUserFollowing(false);
          setIsAbleToView(false);
        
        }
          setInfoLoading(false);
          setLoading(false);
      })
      .catch((error) => {
        if(error.response.status == 403) {
          setIsBlocked(true);
        }
      });

    }, [editProfileOpen, userId, isFollowClicked, isBlocked]);


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

  const handleSettingsOpen = (event) => {
    setOpenSettings(true);
  };

  const handleSettingsClose = (event) => {
    setOpenSettings(false);
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

  const handleVerticalMenuClose = () => {
    setVerticalMenuOpen(false);
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

  if (isBlocked) {
    return (
      <Wrapper>
        <Box className={classes.emptyBody}>
          You cannot view this user's profile ! You have blocked the user or it blocked you.
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
                              <Avatar 
                                src={profileInfo['photo_url']}
                                style={{height:80,width:80}}>
                                {profileInfo['first_name'] && profileInfo['last_name'] ? <>{profileInfo['first_name'].slice(0,1) + profileInfo['last_name'].slice(0,1)}
                                                                                            </>
                                                                                        : <></>}
                                </Avatar>
                            </Button>
                         </Box>
                       </Container> 
                    </Grid>
                    <Grid item xs>
                      <Stack spacing={1}>
                        {profileInfo['birthday'] && curUserId === userId ? <Button 
                                                                            size="medium"
                                                                            variant="text"
                                                                            startIcon={ <CakeIcon color="primary"></CakeIcon>}
                                                                            onClick={handleEditProfileDialogOpen}
                                                                            className={classes.buttonText} 
                                                                            >
                                                                            {convertBirthday(profileInfo['birthday'])}
                                                                          </Button>
                                                                        : <Stack 
                                                                            direction='row' 
                                                                            justifyContent='center'>
                                                                            <CakeIcon color="primary"/>
                                                                            <Typography> 
                                                                              {convertBirthday(profileInfo['birthday'])}
                                                                            </Typography>
                                                                          </Stack>
                          }
                      </Stack>
                    </Grid>
                    {curUserId === userId ? 
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
                        subheader={profileInfo['username']}
                        action={ curUserId === userId ? 
                                                      <>
                                                      <IconButton
                                                        size="small"
                                                        onClick={handleSettingsOpen}
                                                      >
                                                        <SettingsIcon />
                                                      </IconButton>
                                                      <SettingsDialog
                                                        open={openSettings}
                                                        onClose={handleSettingsClose}
                                                        curProfileInfo={profileInfo}>
                                                        </SettingsDialog>
                                                      </>
                                                        :
                                                        <>
                                                        <VerticalMenu
                                                          anchorEl={verticalMenuOpen}
                                                          setAnchorEl={setVerticalMenuOpen}
                                                          onClose={handleVerticalMenuClose}
                                                          userThatIsToBeViewed={userId}
                                                          usernameViewed={profileInfo['username']}
                                                          userThatViews={curUserId}
                                                          setIsBlocked={setIsBlocked}>
                                                        </VerticalMenu></>}
                                                        />                 
                    <CardContent>
                        {!profileInfo['biography'] ? <>
                                                { curUserId === userId ? <>
                                                                          <Typography variant="h6" color="primary">
                                                                            My Biography
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
                                                   My Biography
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
                  <Stack spacing={1}>
                    {isAbleToView ? <>
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
                                    </>
                                  : <>
                                      <Button
                                          disabled
                                          className={classes.buttonText}
                                        >
                                          {profileInfo['followers_count']}
                                          <br />
                                          Followers 

                                        </Button>
                                          <Button 
                                          disabled
                                          className={classes.buttonText} 
                                        >
                                          {profileInfo['followings_count']}
                                            <br />
                                          Followings     
                                        </Button>
                                    </>}
                    
                      {curUserId !== userId ? <FollowUnfollow 
                                                isCurUserFollowing={isCurUserFollowing} 
                                                curUser={curUserId} 
                                                followUser={userId}
                                                setIsCurUserFollowing={setIsCurUserFollowing}
                                                setIsFollowClicked={setIsFollowClicked}>
                                                </FollowUnfollow>
                                          :
                                          <></>
                      }
                    </Stack>
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
            {infoLoading ? <CircularProgress></CircularProgress>
                        :  <>{tabValue === "shared" ? <>
                                        <ProfilePostScroll 
                                          userToBeViewed={profileInfo['username']} 
                                          userThatViews={localStorage.getItem('username')}
                                          isShown={isAbleToView}
                                        >
                                        </ProfilePostScroll>
                                      </>
                                   :  <>
                                        <LikedPostScroll 
                                          userToBeViewed={profileInfo['username']} 
                                          userThatViews={localStorage.getItem('username')}
                                          isShown={isAbleToView}
                                         >
                                        </LikedPostScroll>
                                      </> }
                              </>}
        </Container>
      </Paper>
        {isAbleToView ? <>
                        <FollowerDialog open={followingsOpen} onClose={handleFollowingsDialogClose} accounts={profileInfo['followings']} title={'Followings'}/>
                        <FollowerDialog open={followersOpen}  onClose={handleFollowersDialogClose}  accounts={profileInfo['followers']} title={'Followers'}/>
                        </>
                      : <></>
        }
        <EditProfileDialog  open={editProfileOpen} onClose={handleEditProfileDialogClose} curProfileInfo={profileInfo}></EditProfileDialog>
      </Wrapper>
    </div>
  );
}

export default Profile;
