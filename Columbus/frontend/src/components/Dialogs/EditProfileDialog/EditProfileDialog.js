import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

export default function EditProfileDialog(props) {

 const { open, onClose, curProfileInfo } = props;

 const [aboutMe, setAboutMe] = useState([])

 const [value, setValue] = React.useState(new Date('1960-01-01'));

  const handleChange = (newValue) => {
    setValue(newValue);
  };
 useEffect(() => {
        if(curProfileInfo['aboutMe'].length == 0) {
          setAboutMe("")
        } else {
           setAboutMe(curProfileInfo['aboutMe'])
        }
    }, [])

   const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log("Successfull Edit!");

	};

  // use Message Dialog

  return (

      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Edit Profile Information</DialogTitle>
        <DialogContent dividers>
         <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
			        <Grid item xs={12} >
                <TextField
                  disabled
                  name="userName"
                  fullWidth
                  id="userName"
                  label="Username"
                  autoFocus
                  defaultValue={curProfileInfo['username']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  defaultValue={curProfileInfo['firstName']}
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
                  defaultValue={curProfileInfo['lastName']}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled
                  fullWidth
                  id="email"
                  type="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  defaultValue={curProfileInfo['email']}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="location"
                  type="location"
                  label="Location"
                  name="location"
                  defaultValue="Ankara"
                />
              </Grid>
              <Grid item xs={6} >
                 <LocalizationProvider dateAdapter={AdapterDateFns}>
                   <DesktopDatePicker
                      label="Birthday"
                      inputFormat="MM/dd/yyyy"
                      value={value}
                      onChange={handleChange}
                      renderInput={(params) => <TextField {...params} />}

                  /></LocalizationProvider>
              </Grid>
              <Grid item xs={12} >
                <TextField
                  fullWidth
                  id="aboutMe"
                  label="AboutMe"
                  multiline
                  rows={4}
                  defaultValue={aboutMe}
                  variant="filled"
                  autoFocus
                />
              </Grid>
            </Grid>
            </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Update</Button>
        </DialogActions>
      </Dialog>
  );
}