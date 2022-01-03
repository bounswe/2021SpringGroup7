import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from 'react-router-dom'

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';

import CheckIcon from '@mui/icons-material/Check';
import SettingsIcon from '@material-ui/icons/Settings';

import USER_SERVICE from "../../../services/user";
import MessageDialog from "../MessageDialog/MessageDialog";

export default function SettingsDialog(props) {

  const { open, onClose, curProfileInfo } = props;
  const navigate = useNavigate();

  const [password, setPassword] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [isDeleted, setIsDeleted] = useState(null);

  const [message, setMessage] = useState('');
  const [openMessage, setOpenMessage] = useState(false);


  useEffect(() => {

      if(!!localStorage.getItem('jwtToken')) 
      {
        setIsDeleted(false);
      }
      else 
      {
        setIsDeleted(true);
      }

      if(curProfileInfo['public']) 
      {
        setIsPublic(true);
      }
      else 
      {
        setIsPublic(false);
      }

  }, []);

  const handleCloseMessage = () => {
		setOpenMessage(false);
        onClose();
	};

  const handleDeleteProfile = (event) => {

    USER_SERVICE.DELETE_PROFILE(localStorage.getItem('userid'),password)
        .then((res) => {
            setMessage("You have successfully deleted your profile!");
            setOpenMessage(true);
            localStorage.setItem('jwtToken', null);
            //navigate("/home")
        })
        .catch((error) => {
            setMessage("Delete profile not successful, try again later!");
            setOpenMessage(true);
            
        })
  }

  const handleProfileVisibility = (event) => {
    setIsPublic(event.target.value);
  }

  const updateProfileVisibility = (event) => {

    USER_SERVICE.SET_PROFILEINFO({
                                    'user_id'   : localStorage.getItem('userid'),
                                    'first_name': curProfileInfo['first_name'], 
                                    'last_name' : curProfileInfo['last_name'], 
                                    'photo_url' : curProfileInfo['photo_url'],
                                    'birthday'  : curProfileInfo['birthday'],
                                    'location'  : curProfileInfo['location'],
                                    'biography' : curProfileInfo['biography'],
                                    'public'    : isPublic
                                  })
        .then((res) => {
            const mode = isPublic ? " Public":  " Private"
            setMessage("You have successfully updated your profile visibility mode to" + mode +"!");
            setOpenMessage(true);
        })
        .catch((error) => {
            setMessage("Cannot change mode now, try again later!");
            setOpenMessage(true);
        })
  };


  if(isDeleted) 
  {
    return <Navigate to='/'/>
  }

  return (

    <Dialog 
      open={open} 
      onClose={onClose}
    >
      <DialogTitle>
        <SettingsIcon/>
        Settings
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={6} >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{alignItems:'center'}}
                  >
              <FormControl>
                      <InputLabel id="demo-simple-select-helper-label">Profile Visibility Options</InputLabel>
                      <Select
                          labelId="demo-simple-select-helper-label"
                          defaultValue={curProfileInfo['public']}
                          value={isPublic}
                          label="Profile Visibility Options"
                          onChange={handleProfileVisibility}
                         
                      >
                      <MenuItem value={true}>Public</MenuItem>
                      <MenuItem value={false}>Private</MenuItem>
                      </Select>
                      <FormHelperText
                        sx={{fontSize:9}}
                        >In private mode, only your followers can view your profile.</FormHelperText>
                </FormControl>

                  </Stack>
            </Grid>
              <Grid item xs={6} >  
              <IconButton 
                  color = "primary" 
                  onClick={updateProfileVisibility} 
                  sx={{textTransform:'none'}}
                  >
                    <CheckIcon></CheckIcon>
                  </IconButton>  
              </Grid>

            <Grid item xs={6}>
                <Stack
                direction="column"
                  spacing={1}
                  
                  >
              <TextField
                  label = "Password"
                  variant = "filled"
                  type = "password"
                  required value = { password }
                  onChange = { e => setPassword(e.target.value)}
                  /> 
                <Button 
                  variant = "contained" 
                  onClick={handleDeleteProfile} 
                  sx={{textTransform:'none',alignItems:'center',width:150}}>
                      Delete Profile
                  </Button>   
                </Stack>
            </Grid>

          </Grid>
          </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>

      <MessageDialog open={openMessage} handleClose={handleCloseMessage} txt={message} />
    </Dialog>
      
  );
}
