import * as React from 'react';
import columbusLogo from '../../assets/logo.svg';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MessageDialog from '../../components/Dialogs/MessageDialog'
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
var API_BASE = 'http://ec2-35-158-103-6.eu-central-1.compute.amazonaws.com:8000';
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/bounswe/2021SpringGroup7">
        Columbus
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const theme = createTheme({
  palette: {
    brown: createColor('#a67c52'),
    green: createColor('#009245'),
    darkGreen: createColor('#007c3b'),
    blue: createColor('#0071bc'),
    darkBlue: createColor('#0060a0'),
    pink: createColor('#f5e1dc'),
    grey: createColor('#6c746e'),
  },
});

export default function SignUp() {
  const [ message, setMessage] = React.useState('');
  const [ openRegister, setOpenRegister] = React.useState(false);
  const handleCloseRegister = () => {
		setOpenRegister(false);
		};
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({'user_name': data.get('userName'),  'first_name':data.get('firstName'), 'last_name':data.get('lastName'), 'user_email':data.get('email'), 'password':data.get('password')})
	};
	fetch(API_BASE + '/guest/register/', requestOptions)
	.then(res => {
		if(res.ok) {
		}
		return res.json().then(text => {
			throw new Error(text['return'])})
	}
	)
	.catch((error) => {
		setMessage(error.message)
		setOpenRegister(true)
	}).finally(()=>{
	});
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        <img src={columbusLogo}  alt="logo" height = "100" />
          
          <Typography component="h1" variant="h5" style={{color:"#a67c52"}}>
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
			<Grid item xs={12} >
                <TextField
                  autoComplete="user-name"
                  name="userName"
                  required
                  fullWidth
                  id="userName"
                  label="Username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  type="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12} >
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
				
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I agree to the Terms and Conditions."
                />
              </Grid>
            </Grid>
            <Button
              color="blue"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mb: 2,mt: 2}} />
        <MessageDialog open={openRegister} handleClose={handleCloseRegister} txt={message} />
      </Container>
    </ThemeProvider>
  );
}