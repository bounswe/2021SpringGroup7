import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(2),

        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '300px',
        },
        '& .MuiButtonBase-root': {
            margin: theme.spacing(2),
        },
    },
    error: {
        color: 'red',
    }
}));

const LoginForm = ({ handleClose, showError}) => {
    const classes = useStyles();
 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        handleClose(username, password);
    };

    return ( 
    < form 
    className = { classes.root }
    onSubmit = { handleSubmit } 
    >
        <TextField 
        label = "Username"
        variant = "filled"
        type = "text"
        required value = { username }
        onChange = { e => setUsername(e.target.value) }
        /> 
        
        <TextField 
        label = "Password"
        variant = "filled"
        type = "password"
        required value = { password }
        onChange = { e => setPassword(e.target.value)
        }
        /> 
        <div>
        {showError ? <p className={classes.error}>Email or Password is wrong!</p> : null}
        <Button 
        type = "submit"
        variant = "contained"
        color = "primary" 
        >
            Login 
        </Button>
        </div> 
    </form>
    );
};

export default LoginForm;