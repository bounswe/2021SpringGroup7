import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import Error from '../../assets/error.png'
import Success from '../../assets/success.png'
import Logo from '../../components/Logos/LogoWithText'
import Button from "@material-ui/core/Button";
import { useNavigate, useLocation } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    Applogo: {
        'height': '20vmin',
        'padding': '2em',
        'pointer-events': 'none',
    },
    confirmationImage: {
        'height': '7vmin',
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

function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function EmailConfirmation(){
    let query = useQuery();
    let navigate = useNavigate();
    const classes= useStyles();

    const [isError, setError] = useState(false);
    
    useEffect(()=> {
        setError(query.get("error"));
    }, []);
    

    return (
        <div className={classes.root}>
            <Logo className={classes.Applogo} alt='Logo'/>
            {isError ? <div> <img src={Error} className={classes.confirmationImage} alt='Error' /> <p>Error while confirming email</p></div> : <div> <img src={Success} className={classes.confirmationImage} alt='Success' /> <p>Succesfully confirmed email</p></div>} 
            <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
					        Go to login page
            </Button> 
            
        </div>
    )
}
