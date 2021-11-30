import React, { useState , useEffect } from 'react'

import { Box } from "@material-ui/core";
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

export default function Notification(props) {

    const { notification } = props;
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if(notification['actionType'] == 'follow') 
        {
            setMessage(notification['actionTaker'] + " followed you.")
        }
        else if(notification['actionType'] == 'like') 
        {
            setMessage(notification['actionTaker'] + " liked your post.")
        }
    }, [])

    return (
    <>
        <Avatar sx={{ width: 30, height:30}}>{notification['actionTaker'][0]}</Avatar>
        <Box sx={{flexGrow: 1}}></Box>
        <Typography>
                {message}
        </Typography>
    </>
    )
}