import React, { useState , useEffect } from 'react'

import { Box } from "@material-ui/core";
import Typography from '@mui/material/Typography';

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
        <Box>
        <Typography>
                {message}
        </Typography>
        </Box>
    )
}