import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

import USER_SERVICE from "../../../services/user";
import MessageDialog from "../MessageDialog/MessageDialog";

export default function EditProfileDialog(props) {

 const { open, onClose, curProfileInfo } = props;

 const [file, setFile] = React.useState(curProfileInfo['profilePic']);
 const [fileData, setFileData] = React.useState(null);
 const [openPreviewDialog, setOpenPreviewDialog] = React.useState(false);

 const [dateValue, setDateValue] = React.useState(new Date(curProfileInfo['birthday']));

 const [message, setMessage] = React.useState('');
 const [openMessage, setOpenMessage] = React.useState(false);



  const handlePreview = (event) => {
      setOpenPreviewDialog(true);
  };

  const handlePreviewClose = (event) => {
    setOpenPreviewDialog(false);
};

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setFileData(reader.result);
    })
    reader.readAsDataURL(event.target.files[0])
  };

  const handleDateChange = (newValue) => {
    setDateValue(newValue);
  };

  const handleCloseMessage = () => {
		setOpenMessage(false);
    onClose();
	};

  const handleEditProfile = (event) => {
    event.preventDefault();
    const data = new FormData(document.getElementById("edit-form"));

    var month = dateValue.getUTCMonth() + 1; //months from 1-12
    var day = dateValue.getUTCDate();
    var year = dateValue.getUTCFullYear();
    const birthday = year + "-" + month + "-" + day;

    USER_SERVICE.SET_PROFILEINFO({
                                    'id'        : curProfileInfo['user_id'],
                                    'username'  : curProfileInfo['username'],  
                                    'first_name': data.get('firstName'), 
                                    'last_name' : data.get('lastName'), 
                                    'photo_url' : "",
                                    'email'     : curProfileInfo['email'], 
                                    'birthday'  : birthday,
                                    'location'  : data.get('location'),
                                    'biography' : data.get('biography')
                                  })
    .then((res) => {
          setMessage("You have successfully edit your profile information!");
          setOpenMessage(true);
      })
      .catch((error) => {
        setMessage("Edit not successful, try again later!");
        setOpenMessage(true);
      })
  }


  return (

      <Dialog 
        open={open} 
        onClose={onClose}
      >
        <DialogTitle>
          Edit Profile Information
        </DialogTitle>
        <DialogContent dividers>
         <Box component="form" onSubmit={handleEditProfile} id="edit-form" sx={{ mt: 3 }}>
            <Grid container spacing={2}>
             
               <Grid item xs={6} >
                 <Typography variant="inherit" noWrap>
                        {file ? file.name : ""}
                      </Typography>
                  <Stack direction="row" spacing={1} gutterBottom>
              
                       {file ? <Button variant="outlined" size='small' sx={{fontSize: 10}} onClick={handlePreview}>Preview</Button> : <></>}
                       
                      <Dialog open={openPreviewDialog} onClose={handlePreviewClose}>
                        <img src={fileData}/>
                      </Dialog>
                      <Button variant="outlined" component="label" size='small' sx={{fontSize: 10}}>
                        Upload Profile Picture
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          hidden
                        />
                      </Button>
                    </Stack>

              </Grid>
			        <Grid item xs={6} >
                
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
                  defaultValue={curProfileInfo['first_name']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  defaultValue={curProfileInfo['last_name']}
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
                  defaultValue={curProfileInfo['location']}
                />
              </Grid>
              <Grid item xs={6} >
                 <LocalizationProvider dateAdapter={AdapterDateFns}>
                   <DesktopDatePicker
                      mask="____-__-__"
                      id="birthday"
                      label="Birthday"
                      inputFormat="yyyy-MM-dd"
                      maxDate={new Date('2021-12-14')}
                      value={dateValue}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} />}
                  />
                  </LocalizationProvider>
              </Grid>
              <Grid item xs={12} >
                <TextField
                  fullWidth
                  id="biography"
                  name="biography"
                  label="Biography"
                  multiline
                  rows={4}
                  defaultValue={curProfileInfo['biography']}
                  variant="filled"
                  autoFocus
                />
              </Grid>
            </Grid>
            </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleEditProfile}>Update</Button>
        </DialogActions>

        <MessageDialog open={openMessage} handleClose={handleCloseMessage} txt={message} />
      </Dialog>
      
  );
}