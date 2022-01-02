import React, { useState , useEffect } from 'react'

import { Box } from "@material-ui/core";
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import USER_SERVICE from '../../services/user';

export default function FollowRequest(props) {

    const { request, closeNotifications } = props;

    const [message, setMessage] = useState('')
    const [actor, setActor] = useState('')
    const [profilePhoto, setProfilePhoto] = useState('')
    const [requestID, setRequestID] = useState(null)
   
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackMessage, setSnackMessage] = useState(false);
    const [acceptSuccess, setAcceptSuccess] = useState(false);

    useEffect(() => {

        setActor(request['username']);
        setMessage(request['username'] + ' wants to follow you.');
        setRequestID(request['request_id'])
        if(!!request['photo_url']) 
        {
            setProfilePhoto(request['photo_url']);
        }

    }, [])


    const acceptFollowRequest = () => 
    {
        USER_SERVICE.ACCEPT_FOLLOWREQUEST(requestID)
            .then((res) => 
            {
              setAcceptSuccess(true);
              setSnackMessage(actor + ' started to follow you!');
              setOpenSnackBar(true);
              setTimeout(() => 
              {
                closeNotifications();
              }, 2000);
            })
            .catch((error) => 
            {
                setAcceptSuccess(false);
                setSnackMessage('Accept is not successful, try again later!');
                setOpenSnackBar(true);
                setTimeout(() => 
                {
                  closeNotifications();
                }, 2000);
            })
    }

    const handleCloseSnackbar = (event, reason) => 
    {
        if (reason === 'clickaway') 
        {
        return;
        }
        setOpenSnackBar(false);
    };

    return (
    <>
        <Avatar 
            sx={{ width: 30, height:30}}
            src={profilePhoto}
            >
            {actor.substring(0,1).toUpperCase()}
        </Avatar>
        <Box sx={{flexGrow: 1}}/>
        {message.length < 50 ? 
                                <Typography  sx={{fontSize: 13}}>
                                    {message}
                                </Typography>
                              :
                                <Tooltip title={message}>
                                    <Typography  sx={{fontSize: 13}}>
                                        {message.substring(0,50) + '...'}
                                    </Typography>
                                </Tooltip>
        }

        <Box sx={{flexGrow: 4}}/>
        
        <IconButton 
            color="success"
            onClick={acceptFollowRequest}>
            <CheckIcon />
        </IconButton>

        <Snackbar 
            open={openSnackBar} 
            autoHideDuration={6000} 
            onClose={handleCloseSnackbar}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
                }}>
            <MuiAlert 
                elevation={6} 
                variant="filled" 
                onClose={handleCloseSnackbar} 
                severity={acceptSuccess ? "success" : "error"} 
                sx={{ width: '100%' }}>
                {snackMessage}
            </MuiAlert>
        </Snackbar>
    </>
    )
}