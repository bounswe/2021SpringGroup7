import React, { useState , useEffect } from 'react'

import { Box } from "@material-ui/core";
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';


export default function Notification(props) {

    const { notification } = props;

    return (
    <>
        <Avatar sx={{ width: 30, height:30}}>{notification['actor']['@id'].substring(0,1)}</Avatar>
        <Box sx={{flexGrow: 1}}></Box>
        <Tooltip title={notification['summary']}>
        <Typography  sx={{fontSize: 13}}>
                {notification['summary'].substring(0,50) + '...'}
        </Typography>
        </Tooltip>
    </>
    )
}