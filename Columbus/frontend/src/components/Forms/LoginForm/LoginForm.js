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
}));

const LoginForm = ({ handleClose }) => {
    const classes = useStyles();
 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        handleClose(email, password);
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
        required value = { email }
        onChange = { e => setEmail(e.target.value) }
        /> 
        
        <TextField 
        label = "Password"
        variant = "filled"
        type = "password"
        required value = { password }
        onChange = { e => setPassword(e.target.value) }
        /> 
        <div>
        
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