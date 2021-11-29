import React from 'react'

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export default function Notification(props) {

    const { notification } = props;

    return (
        <Paper>
            <Typography>
                {notification['message']}
            </Typography>
        </Paper>
    )
}