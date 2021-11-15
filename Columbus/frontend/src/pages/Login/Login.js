import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Logo from '../../components/Logos/LogoWithText'
import LoginForm from '../../components/Forms/LoginForm/LoginForm';
import ModalDialog from '../Register/ModalDialog'
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    Applogo: {
        'height': '20vmin',
        'padding': '2em',
        'pointer-events': 'none',
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        '& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: '300px',
		},
		'& .MuiButtonBase-root': {
			margin: theme.spacing(2),
		},
    }
}));

var API_BASE = "http://ec2-35-158-103-6.eu-central-1.compute.amazonaws.com:8000";

if (process.env.NODE_ENV === "development") {
  API_BASE = "http://localhost:8000";
}

export default function Login({setAuthenticated}){
    const classes= useStyles();
    
    const [openRegister, setOpenRegister] = useState(false);
    const [isError, setError] = useState(false);
    
    const handleOpenRegister = () => {
        setOpenRegister(true)
    };
    
    const handleCloseRegister = () => {
    setOpenRegister(false);
    };

    const handleLogin = (username, password) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'user_name': username,  password})
        };
        fetch(API_BASE + '/guest/login', requestOptions)
        .then(response => {
            if(response.ok){
                response.json()
            }
            throw new Error(response.json()['return'])
        })
        .then(data => {
            setAuthenticated(true)
            localStorage.setItem('jwtToken', 'bearer ' + password);
        })
        .catch((reason) => {
            setError(true);
            console.error(reason);
        });
    
    };
    

    return (
        <div className={classes.root}>
            <Logo className={classes.Applogo} alt='Logo'/>
            <LoginForm handleClose={handleLogin} showError={isError} />
            <Button variant="contained" color="primary" onClick={handleOpenRegister}>
					        Register
            </Button>
            <ModalDialog open={openRegister} handleClose={handleCloseRegister} />  
        </div>
    )
}