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
import ImagePreviewBox from "../../Preview/ImagePreview/ImagePreviewBox";
import { UploadProfileImage } from "../../../config/s3Api";
import { LinearProgressWithValue } from "../../Progress";

export default function EditProfileDialog(props) {

 const { open, onClose, curProfileInfo } = props;

 const [imgUrl, setImgUrl] = useState(curProfileInfo['photo_url']);
 const [fileUploadProgress, setFileUploadProgress] = useState(0);
 const [file, setFile] = useState(curProfileInfo['profilePic']);

 const [dateValue, setDateValue] = useState(new Date(curProfileInfo['birthday']));

 const [message, setMessage] = useState('');
 const [openMessage, setOpenMessage] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    if(event.target.files[0]){
      console.log(event.target.files[0])
        UploadProfileImage(localStorage.getItem('userid'), event.target.files[0], setImgUrl, setFileUploadProgress)
    }else {
      setFile(null);
    }
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
                                    'id'        : localStorage.getItem('userid'),
                                    'username'  : curProfileInfo['username'],  
                                    'first_name': data.get('firstName'), 
                                    'last_name' : data.get('lastName'), 
                                    'photo_url' : imgUrl,
                                    'email'     : curProfileInfo['email'], 
                                    'birthday'  : birthday,
                                    'location'  : {"location": data.get('location'), "latitude": 1, "longitude": 1, "type": "Real"},
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

                      <ImagePreviewBox imageData={imgUrl}/>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          color: "text.primary",
                          mfontWeight: "medium",
                          alignItems: "center",
                          fontSize: 18,
                        }}
                      >
                      
                        {file ?
                          fileUploadProgress !== 100 ? (
                            <LinearProgressWithValue progress={fileUploadProgress} />
                          ) : null
                        : null}
                        <Button variant="contained" component="label" size="small">
                          Upload File
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
                      maxDate={Date.now()}
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