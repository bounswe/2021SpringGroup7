import React, { useState , useEffect } from 'react'

import { Box } from "@material-ui/core";
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';


export default function Notification(props) {

    const { notification } = props;

    const [message, setMessage] = useState('')

    return (
    <>
        <Avatar 
            sx={{ width: 30, height:30}}
            >
            {notification['actor']['@id'].substring(0,1).toUpperCase()}
        </Avatar>
        <Box sx={{flexGrow: 1}}/>
        {notification['summary'].length < 50 ? 
                                                <Typography  sx={{fontSize: 13}}>
                                                      {notification['summary']}
                                                </Typography>
                                            :
                                                <Tooltip title={notification['summary']}>
                                                    <Typography  sx={{fontSize: 13}}>
                                                            {notification['summary'].substring(0,50) + '...'}
                                                    </Typography>
                                                </Tooltip>
        }
    </>
    )
}