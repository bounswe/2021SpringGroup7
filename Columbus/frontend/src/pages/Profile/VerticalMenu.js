import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import USER_SERVICE from '../../services/user';

import ReportMessageDialog from '../../components/Dialogs/ReportMessageDialog/ReportMessageDialog';

const ITEM_HEIGHT = 48;

export default function VerticalMenu(props) {

  const { anchorEl, setAnchorEl, onClose, userThatIsToBeViewed, usernameViewed, userThatViews, setIsBlocked} = props;
  const open = Boolean(anchorEl);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [message, setMessage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reportMessageOpen, setReportMessageOpen] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
    setTimeout(() => {
        setSuccess(false);
        }, 300);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleBlockUser = (event) => {

    USER_SERVICE.BLOCK_USER(userThatViews, userThatIsToBeViewed)    
    .then((res) => {
            setMessage("You have blocked this user!");
            setSuccess(true);
            setOpenSnackBar(true);
            onClose();
            setIsBlocked(true);
      })
      .catch((error) => {
            setMessage("Blocking is not successful. Please, try again later.");
            setOpenSnackBar(true);
            onClose();
      })

  };

  const openReportMessage = (event) => {
    setReportMessageOpen(true);
  }

  const closeReportMessage = (event) => {
    setReportMessageOpen(false);
    onClose();
  }


  const handleReportUser = (event) => {

    event.preventDefault();
    const data = new FormData(document.getElementById("reportMessage-form"));
    
    USER_SERVICE.REPORT_USER(usernameViewed, localStorage.getItem('username'), data.get('reportMessage'))    
    .then((res) => {
            setMessage("You have reported this user!");
            setSuccess(true);
            setOpenSnackBar(true);
            closeReportMessage();
      })
      .catch((error) => {
            setMessage("Reporting is not successful. Please, try again later.");
            setOpenSnackBar(true);
            closeReportMessage();
      })

  
  };


  return (
    <div>
      <IconButton
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
          <MenuItem key={'block'} onClick={handleBlockUser}>
            {'Block User'}
          </MenuItem>
          <MenuItem key={'report'} onClick={openReportMessage}>
            {'Report User'}
          </MenuItem>
      </Menu>

    <ReportMessageDialog
        open={reportMessageOpen}
        handleClose={closeReportMessage}
        reportUser={handleReportUser}
        />

    <Snackbar 
        open={openSnackBar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}>
        <MuiAlert 
            elevation={6} 
            variant="filled" 
            onClose={handleCloseSnackbar} 
            severity={success ? "success" : "error"} 
            sx={{ width: '100%' }}>
            {message}
        </MuiAlert>
    </Snackbar>
    </div>
  );
}