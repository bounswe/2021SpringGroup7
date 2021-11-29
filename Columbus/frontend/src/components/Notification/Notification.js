import React from 'react'

import { Box } from "@material-ui/core";

import Typography from '@mui/material/Typography';

export default function Notification(props) {

    const { notification } = props;

    return (
        <Box>
        <Typography>
                {notification['message']}
        </Typography>
        </Box>
    )
}