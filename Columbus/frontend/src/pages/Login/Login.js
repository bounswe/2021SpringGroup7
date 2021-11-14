import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import logo from '../../assets/Columbus.svg'
import LoginForm from '../../components/Forms/LoginForm/LoginForm';

const useStyles = makeStyles(theme => ({
    Applogo: {
        'height': '50vmin',
        'pointer-events': 'none',
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'end',
        alignItems: 'center'
    },
}));

export default function Login(){
    console.log("in login")
    const classes= useStyles();
    const handleClose = (email, password) => {
        console.log(email, password);
        sessionStorage.setItem('jwtToken', 'bearer 123');
    };

    return (
        <div className={classes.root}>
            <img src={logo} className = {classes.Applogo} alt='Logo' />
            <LoginForm handleClose={handleClose} />
        </div>
    )
}
