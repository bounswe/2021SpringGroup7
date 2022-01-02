import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Grid,
  IconButton,
  Snackbar,
  Paper,
  TextField,
  Link,
} from "@material-ui/core";
import POST_SERVICE from '../../services/post';
import CloseIcon from "@material-ui/icons/Close";
import Delete from "@material-ui/icons/Delete";
import PushPinIcon from '@mui/icons-material/PushPin';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MoreVertIcon from "@material-ui/icons/MoreVert";
export default function Comment(props) {
  const [expandReply, setExpandReply] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentValue, setCommentValue] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [anchor, setAnchor] = useState(null);
  const isMenuOpen = Boolean(anchor);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarMessage('');
    setOpenSnackBar(false);
  };
  const handleComment = () => {
    if(commentValue==""){
      setSnackBarMessage("You should write a comment")
      setOpenSnackBar(true)}
    else{var today=new Date();
    const data = {
      text: commentValue,
      username: localStorage.getItem('username'),
      story_id: props.comment.story_id,
      date: today.toISOString(),
      parent_comment_id: props.comment.id,
      photo_url:props.profilePhoto
    };
    POST_SERVICE.POST_COMMENT({ text: commentValue, username: localStorage.getItem('username'), story_id: props.comment.story_id, parent_comment_id: props.comment.id })
      .then((response) => {
        setSnackBarMessage("Your reply is added!");
        setOpenSnackBar(true);
      }).catch((error) => {
        setSnackBarMessage("Your reply can not added!");
        setOpenSnackBar(true);
      });

    const temp = comments;
    temp.push(data);
    setComments(temp);
    setCommentValue("");}
  };
  useEffect(() => {
    setComments(props.comment.child_comments);
  }, [props])
  const handleReply = () => {
    setExpandReply(!expandReply);
  }
  const handleExpandSettings=(event)=>{
    setAnchor(event.currentTarget);
  };
  const handleSettings=()=>{
    setAnchor(null);
  }
  const settingMenu = (
    <Menu
      elevation={5}
      anchorEl={anchor}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={'primary-search-account-menu'}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleSettings}
    > 
    {localStorage.getItem("username")==props.storyUsername? 
    <><MenuItem >
           <Button
              size="small"
              aria-label="account of current user"
              aria-controls={'primary-search-account-menu'}
              aria-haspopup="true"
              startIcon={<Delete />}
            >
              Delete Comment
            </Button>
          
      </MenuItem><MenuItem >
           <Button
              size="small"
              aria-label="account of current user"
              aria-controls={'primary-search-account-menu'}
              aria-haspopup="true"
              startIcon={<PushPinIcon />}
            >
              Pin Comment
            </Button>
          
      </MenuItem></>:<MenuItem >
           <Button
              size="small"
              aria-label="account of current user"
              aria-controls={'primary-search-account-menu'}
              aria-haspopup="true"
              startIcon={<PushPinIcon />}
            >
              Pin Comment
            </Button>
          
      </MenuItem>}
            </Menu>
  )
  const showAddComment = () => {
    return (

      <Paper style={{ padding: "20px 20px", marginTop: 10 }}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Link href="/">
              <Avatar alt="AT TA" src={props.profilePhoto} />
            </Link>
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>{localStorage.getItem('username')}</h4>
            <p style={{ textAlign: "left" }}>
              <TextField
                style={{ width: "90%" }}
                variant="filled"
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
                required
              ></TextField>
            </p>
            <p style={{ textAlign: "right", color: "gray" }}>
              <Button onClick={handleComment}>COMMENT</Button>
            </p>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  return (
    <Paper
      key={props.index}
      style={{ padding: "20px 20px", marginTop: 10 }}
    >
      {settingMenu}
      <Grid container wrap="nowrap" spacing={2}>
        <Grid item>
          <Avatar alt={props.comment.username} src={props.comment.photo_url} />
        </Grid>
        
        <Grid justifyContent="left" item xs zeroMinWidth>
        
          <h4 style={{ margin: 0, textAlign: "left" }}>
            {props.comment.username}
          </h4>
          
          <p style={{ textAlign: "left" }}>{props.comment.text}</p>
          <p style={{ textAlign: "left", color: "gray" }}>
            {new Date(props.comment.date).toLocaleString('tr-TR')}
          </p>
          <p style={{ textAlign: "right", color: "gray" }}>
            <Button onClick={handleReply}>REPLY</Button>
          </p>
          {expandReply ? showAddComment() : null}
          <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              open={openSnackBar}
              autoHideDuration={6000}
              onClose={handleClose}
              message={snackBarMessage}
              action={
                <React.Fragment>
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={handleClose}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </React.Fragment>
              }
            />
        </Grid>
        <Grid item><Button style={{ textAlign: "right" } } onClick={handleExpandSettings}><MoreVertIcon /></Button></Grid>
      </Grid>
      {comments.length===0? null :<>{comments.map((item, index) => {
        if (item) {
          return (
            <Grid container wrap="nowrap" spacing={2} style={{ marginLeft: '4rem', marginTop: 20}}>
              <Grid item>
                <Avatar alt={item.username} src={item.photo_url} />
              </Grid>
              <Grid justifyContent="left" item xs zeroMinWidth>
                <h4 style={{ margin: 0, textAlign: "left" }}>
                  {item.username}
                </h4>
                <p style={{ textAlign: "left" }}>{item.text}</p>
                <p style={{ textAlign: "left", color: "gray" }}>
                  {new Date(item.date).toLocaleString('tr-TR')}
                </p>
              </Grid>
            </Grid>
          );
        }
      })}</>}
    </Paper>
  );
}