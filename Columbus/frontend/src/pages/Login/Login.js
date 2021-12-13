import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Logo from '../../components/Logos/LogoWithText'
import LogoAnimated from '../../components/Logos/LogoAnimated'
import LoginForm from '../../components/Forms/LoginForm/LoginForm';
import ModalDialog from '../Register/ModalDialog'
import Button from "@material-ui/core/Button";
import AUTHENTICATION_SERVICE from '../../services/authentication';
import {API_INSTANCE} from '../../config/api';

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
        setError(false);
        AUTHENTICATION_SERVICE.LOG_IN(username, password)
        .then(response => {
            API_INSTANCE.defaults.headers.common['Authorization'] = 'TOKEN ' + response.data.return.token;
            localStorage.setItem('jwtToken', 'TOKEN ' + response.data.return.token);
            localStorage.setItem('username', username);
            localStorage.setItem('userid',response.data.return.user_id);
            setAuthenticated(true)
        })
        .catch((error) => {
            setError(true);
            console.error(error.response.data.return);
        });
    
    };

    return (
        <div className={classes.root}>
            <Logo className={classes.Applogo} alt='Logo'/>
            <LoginForm handleClose={handleLogin} showError={isError}/>
            <Button variant="contained" color="primary" onClick={handleOpenRegister}>
					        Register
            </Button>
            {isError ? <div/>:<LogoAnimated/>}
            <ModalDialog open={openRegister} handleClose={handleCloseRegister} />  
        </div>
    )
}
