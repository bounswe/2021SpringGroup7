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
    },
}));

export default function Login({setAuthenticated}){
    const classes= useStyles();
    
    const [openRegister, setOpenRegister] = useState(false);
    
    const handleOpenRegister = () => {
        setOpenRegister(true)
    };
    
    const handleCloseRegister = () => {
    setOpenRegister(false);
    };

    const handleLogin = (email, password) => {
        console.log(email, password);
        localStorage.setItem('jwtToken', 'bearer ' + password);
        setAuthenticated(true);
    };

    return (
        <div className={classes.root}>
            <Logo className={classes.Applogo} alt='Logo'/>
            <LoginForm handleClose={handleLogin} />
            <Button variant="contained" color="primary" onClick={handleOpenRegister}>
					        Register
            </Button>
            <ModalDialog open={openRegister} handleClose={handleCloseRegister} />  
        </div>
    )
}
