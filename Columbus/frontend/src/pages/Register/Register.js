import React, { useState } from 'react';
import MessageDialog from '../../components/Dialogs/MessageDialog'
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
var API_BASE = 'http://ec2-18-197-57-123.eu-central-1.compute.amazonaws.com:8000';
if (process.env.NODE_ENV === 'development') {
	API_BASE = 'http://localhost:8000';
}
const useStyles = makeStyles((theme) => ({
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

const Form = ({ handleClose }) => {
	const classes = useStyles();
	// create state variables for each input
	const [ firstName, setFirstName ] = useState('');
	const [ userName, setUserName ] = useState('');
	const [ lastName, setLastName ] = useState('');
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ message, setMessage] = useState('');
	const [ openRegister, setOpenRegister] = useState(false);
	const [ isLoaded, setIsLoading] = useState(false);
	const handleCloseRegister = () => {
		setOpenRegister(false);
		handleClose();
		};
	const handleSubmit = (e) => {
		setIsLoading(true);
		e.preventDefault();

		const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'user_name': userName,  'first_name':firstName, 'last_name':lastName, 'user_email':email, 'password':password})
        };
        fetch(API_BASE + '/guest/register/', requestOptions)
        .then(res => {
			if(res.ok) {
				setMessage('Successfull Register! \n You should login')
				setOpenRegister(true)
			}
			return res.json().then(text => {
				throw new Error(text['return'])})
		}
		)
        .catch((error) => {
			  setMessage(error.message)
			  setOpenRegister(true)
			
        }).finally(()=>{
			setIsLoading(false)
		});;
		
	};

	return (
		<form className={classes.root} onSubmit={handleSubmit} showError={message} >
			<TextField
				label="User Name"
				variant="filled"
				required
				value={userName}
				onChange={(e) => setUserName(e.target.value)}
			/>
			<TextField
				label="First Name"
				variant="filled"
				required
				value={firstName}
				onChange={(e) => setFirstName(e.target.value)}
			/>
			<TextField
				label="Last Name"
				variant="filled"
				required
				value={lastName}
				onChange={(e) => setLastName(e.target.value)}
			/>
			<TextField
				label="Email"
				variant="filled"
				type="email"
				required
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<TextField
				label="Password"
				variant="filled"
				type="password"
				required
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<div>
				<Button variant="contained" onClick={handleClose}>
					Cancel 
				</Button>
				<Button type="submit" variant="contained" color="primary">
					Signup 
				</Button>
			</div>
			{isLoaded ? <p >Loading...</p> : null}
			<MessageDialog open={openRegister} handleClose={handleCloseRegister} txt={message} />  
		</form>
	);
};
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
export default Form;
