import React, { useState, useEffect} from "react";

import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

import Button from '@mui/material/Button';

import MessageDialog from "../../components/Dialogs/MessageDialog/MessageDialog";
import {useStyles} from "./Profile.styles"

import USER_SERVICE from "../../services/user";

const follow = (curUserId, followId) => {
    USER_SERVICE.FOLLOW_USER(curUserId,followId)
      .then((res) => {

        })
        .catch((error) => {
          console.log(error.response.data.return);
        });
  };

const unfollow  = (curUserId, unfollowId)  => {
    USER_SERVICE.UNFOLLOW_USER(curUserId,unfollowId)
      .then((res) => {

        })
        .catch((error) => {
          console.log(error.response.data.return);
        });
  };


function FollowUnfollow(props) {

   const classes = useStyles();
  
   const { isCurUserFollowing, followUser, curUser, setIsCurUserFollowing, setIsFollowClicked } = props;

  const handleFollow = (e) => {
    e.preventDefault();
    setIsCurUserFollowing(true);
    follow(curUser,followUser);
    setIsFollowClicked(true);

  };

  const handleUnfollow = (e) => {
    e.preventDefault();
    setIsCurUserFollowing(false);
    unfollow(curUser,followUser);
    setIsFollowClicked(false);
  };

   
    return (<>
                { isCurUserFollowing ?
                                    <Button 
                                    size="small"
                                    color="primary" 
                                    variant="outlined"
                                    onClick={handleUnfollow}
                                    className={classes.buttonText} 
                                    startIcon={ <PersonRemoveIcon/>}
                                    style={{width:'92px', textTransform: 'none'}}
                                    >
                                    Unfollow 
                                    </Button>
                                :
                                    <Button 
                                    size="small"
                                    color="primary" 
                                    variant="outlined"
                                    onClick={handleFollow}
                                    className={classes.buttonText} 
                                    startIcon={ <PersonAddAlt1Icon/>}
                                    style={{width:'92px',textTransform: 'none'}}
                                >
                                    Follow 
                                    </Button>
                } 

                </> );
}

export default FollowUnfollow;