import { React, useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Snackbar from '@mui/material/Snackbar';


import ADMIN_SERVICE from '../../services/admin';

import CheckIcon from '@mui/icons-material/Check';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

function ReportedUser(props) {

  const { reportedUser, setUserAction } = props;

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [message, setMessage] = useState(false);

 const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleSafeUser = () => 
  {
      ADMIN_SERVICE.ACTION_REPORTEDUSER(reportedUser['report_id'],true)
      .then((res) => {
            setMessage(res.data.return);
            setOpenSnackBar(true);
            setTimeout(() => {
                setUserAction(true);
            }, 1000);   
        })
      .catch((error) => {

      });
    
  };

    const handleUnsafeUser = () => 
  {
      ADMIN_SERVICE.ACTION_REPORTEDUSER(reportedUser['report_id'],false)
      .then((res) => {
          setMessage(res.data.return);
          setOpenSnackBar(true);
          setTimeout(() => {
                setUserAction(true);
            }, 1000);
        })
      .catch((error) => {

      });
    
  };

    if(reportedUser === "No Reported User") 
  {
    return (
        <Container fixed>
            No reported user.
        </Container>
      );
  }


  return (
      <>
        <Container fixed>
            Reported User
             <List>
            <ListItem
             secondaryAction={
                    <Stack direction="row" spacing={1}>
                        <Button 
                            variant="contained"
                            edge="end" 
                            aria-label="delete"
                            color="success"
                            onClick={handleSafeUser}
                            endIcon={<CheckIcon/>}>
                        Safe
                        </Button>
                        <Button 
                            variant="contained"
                            edge="end" 
                            aria-label="delete"
                            color="error"
                            onClick={handleUnsafeUser}
                            endIcon={<PriorityHighIcon/>}>
                        Unsafe
                        </Button>
                    </Stack>
                  }>
            <ListItemAvatar>
                <Avatar src={reportedUser['reported_user']['photo_url']}>
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={reportedUser['reported_user']['username']}
            />
            </ListItem>                            
            </List>
            <Box>
              <Grid xs container direction="column" spacing={6}>
    
                  <Grid item xs={7} sm>

                    <Card  variant="elevation">
                      <CardHeader 
                        title={''}
                        subheader={'Report Details'}
                       />
                    <CardContent>
                            <Typography variant="h10" color="primary">
                               {'Name'}
                            </Typography>
                            <Typography variant="body2" color="primary">
                               {reportedUser['reported_user']['first_name'] + ' ' + reportedUser['reported_user']['last_name']}
                            </Typography>
                            <Typography variant="h10" color="primary">
                               {'Email'}
                            </Typography>
                            <Typography variant="body2">
                                {reportedUser['reported_user']['email']}
                            </Typography>
                            <Typography variant="h10" color="primary">
                               {'Report Reason'}
                            </Typography>
                            <Typography variant="body2">
                                {reportedUser['report_text']}
                            </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
              </Grid>
            </Box>
          </Container>

        <Snackbar 
            open={openSnackBar} 
            autoHideDuration={6000} 
            onClose={handleCloseSnackbar}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            message={message}>
        </Snackbar>
    </>
  );
}

export default ReportedUser;




