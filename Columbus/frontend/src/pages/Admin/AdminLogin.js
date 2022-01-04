import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Logo from '../../components/Logos/LogoWithText'
import LogoAnimated from '../../components/Logos/LogoAnimated'
import LoginForm from '../../components/Forms/LoginForm/LoginForm';
import ADMIN_SERVICE from '../../services/admin';

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

export default function AdminLogin({setAuthenticated}){
    const classes= useStyles();
    
    const [isError, setError] = useState(false);

    const handleLogin = (username, password) => {

        setError(false);
        ADMIN_SERVICE.LOGIN(username, password)
                        .then(response => 
                        {
                            localStorage.setItem('login_hash',response.data.return);
                            setAuthenticated(true)
                            console.log('login hash ', localStorage.getItem('login_hash'))
                        })
                        .catch((error) =>
                        {
                            setError(true);
                            console.error(error);
                        });
    
    };

    return (
        <div className={classes.root}>
            <Logo className={classes.Applogo} alt='Logo'/>
            <LoginForm handleClose={handleLogin} showError={isError}/>
            {isError ? <div/>:<LogoAnimated/>}       
        </div>
    )
}
