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

function ReportedStory(props) {

  const { reportedStory, storyAction, setStoryAction } = props;

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [message, setMessage] = useState(false);

 const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleSafeStory = () => 
  {
      ADMIN_SERVICE.ACTION_REPORTEDSTORY(reportedStory['report_id'],true)
      .then((res) => {
            setMessage(res.data.return);
            setOpenSnackBar(true);
            setTimeout(() => {
                setStoryAction(!storyAction);
            }, 600);   
        })
      .catch((error) => {

      });
    
  };

    const handleUnsafeStory = () => 
  {
      ADMIN_SERVICE.ACTION_REPORTEDSTORY(reportedStory['report_id'],false)
      .then((res) => {
          setMessage(res.data.return);
          setOpenSnackBar(true);
          setTimeout(() => {
                setStoryAction(!storyAction);
            }, 600);
        })
      .catch((error) => {

      });
    
  };

    if(reportedStory === "T") 
  {
    return (
        <Container fixed>
            No reported story.
        </Container>
      );
  }


  return (
      <>
        <Container fixed>
             Reported Story
             <List>
            <ListItem
             secondaryAction={
                    <Stack direction="row" spacing={1}>
                        <Button 
                            variant="contained"
                            edge="end" 
                            aria-label="delete"
                            color="success"
                            onClick={handleSafeStory}
                            endIcon={<CheckIcon/>}>
                        Safe
                        </Button>
                        <Button 
                            variant="contained"
                            edge="end" 
                            aria-label="delete"
                            color="error"
                            onClick={handleUnsafeStory}
                            endIcon={<PriorityHighIcon/>}>
                        Unsafe
                        </Button>
                    </Stack>
                  }>
                <ListItemAvatar>
                    <Avatar src={reportedStory['reported_story']['photo_url']}>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={reportedStory['reported_story']['owner_username']}
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
                               {'Story Owner'}
                            </Typography>
                            <Typography variant="body2">
                                {reportedStory['reported_story']['owner_username']}
                            </Typography>
                            <Typography variant="h10" color="primary">
                               {'Story Title'}
                            </Typography>
                            <Typography variant="body2">
                               {reportedStory['reported_story']['title']}
                            </Typography>
                            <Typography variant="h10" color="primary">
                               {'Report Reason'}
                            </Typography>
                            <Typography variant="body2">
                                {reportedStory['report']}
                            </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
              </Grid>
            </Box>
          </Container>

        <Snackbar 
            open={openSnackBar} 
            autoHideDuration={600} 
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

export default ReportedStory;




