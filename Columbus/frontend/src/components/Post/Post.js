import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  Typography,
  IconButton,
  Button,
  Grid,
  Paper,
  TextField,
  makeStyles,
  Link,
  Snackbar,
  Chip,
} from "@material-ui/core";
import clsx from "clsx";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DateRange from "@material-ui/icons/DateRange";
import LocationOn from "@material-ui/icons/LocationOn";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddCommentIcon from "@material-ui/icons/AddComment";
import CloseIcon from "@material-ui/icons/Close";
import ArrowForward from "@material-ui/icons/ArrowForward";
import Add from "@material-ui/icons/Add";
import Comment from "../Comment/Comment"
import LocationDialog from '../Dialogs/PostLocationDialog/PostLocationDialog'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import POST_SERVICE from '../../services/post';
import api from "../../services/post";
import { tableBodyClasses } from "@mui/material";

const imgLink =
  "https://images.pexels.com/photos/3747505/pexels-photo-3747505.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "90%",
    borderRadius: 10,
    margin: "5%",
    flexDirection: 'column',
    palette: {
      brown: createColor('#a67c52'),
      green: createColor('#009245'),
      darkGreen: createColor('#007c3b'),
      blue: createColor('#0071bc'),
      darkBlue: createColor('#0060a0'),
      pink: createColor('#f5e1dc'),
      grey: createColor('#6c746e'),
    },
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    paddingRight: 30,
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: "#a67c52",
  },
  chip: {
    backgroundColor: "#007c3b",
    color: "white"
  }
}));

export default function Post(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [expandComment, setExpandComment] = useState(false);

  const [storyData, setStoryData] = useState(null);
  const [storyDate1, setStoryDate1] = useState("");
  const [storyDate2, setStoryDate2] = useState("");
  const [curUser, setCurUser] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [comments, setComments] = useState([]);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [openLocation, setOpenLocation] = useState(false);


  useEffect(() => {
    setStoryData(props.post);
    setCurUser(props.curUser);
    setLiked(props.post.is_liked)
    setLikeCount(props.post.numberOfLikes)
    setCommentCount(props.post.numberOfComments)
    if(props.post.time_start[0].type=="specific"){
      if(props.post.time_start[0].date){
        setStoryDate1(props.post.time_start[0].date)
      }
      else {
      if(props.post.time_start[0].year)
        setStoryDate1(props.post.time_start[0].year)
      if(props.post.time_start[0].month)
        setStoryDate1(props.post.time_start[0].month+"."+props.post.time_start[0].year)
      if(props.post.time_start[0].day)
        setStoryDate1(props.post.time_start[0].day+"."+props.post.time_start[0].month+"."+props.post.time_start[0].year)
      }
    }
    if(props.post.time_end[0].type=="specific"){
      if(props.post.time_end[0].date){
        setStoryDate2(props.post.time_end[0].date)
      }
      else {
      if(props.post.time_end[0].year)
        setStoryDate2(props.post.time_end[0].year)
      if(props.post.time_end[0].month)
        setStoryDate2(props.post.time_end[0].month+"."+props.post.time_end[0].year)
      if(props.post.time_end[0].day)
        setStoryDate2(props.post.time_end[0].day+"."+props.post.time_end[0].month+"."+props.post.time_end[0].year)
      }
    }
    var postdata = { 'story_id': props.post.story_id }
    POST_SERVICE.GET_COMMENTS(postdata)
      .then(resp => {
        setComments(
          resp.data.return.comments
        );
      })
      .catch((error) => {
      });
  }, [props, openLocation]);


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleExpandComment = () => {
    setExpandComment(!expandComment);
  };



  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarMessage('');
    setOpenSnackBar(false);
  };

  const handleLike = () => {
    var dat = {
      "story_id": storyData.story_id,
      "user_id": localStorage.getItem('userid'),
    };
    POST_SERVICE.LIKE_POST(dat)
      .then(response => {
        if (response.data.response.isLiked == true) {
          setLikeCount(likeCount + 1)
          setSnackBarMessage('You liked this story!');
        }
        else {
          setLikeCount(likeCount - 1)
          setSnackBarMessage('You unliked this story!');
        }
        setLiked(response.data.response.isLiked);
      })
      .catch((error) => {

        setSnackBarMessage(error.response.data.return);
      });
    setOpenSnackBar(true);
  };
  const handleOpenLocation = () => {
    setOpenLocation(true);
  };
  const handleCloseLocation = () => {
    setOpenLocation(false);
  };


  const handleComment = () => {
    setExpandComment(true);
    var today=new Date();
    const data = {
      text: commentValue,
      username: localStorage.getItem('username'),
      story_id : storyData.story_id,
      date: today.toISOString(),
      parent_comment_id: 0,
      child_comments: []
    };
    POST_SERVICE.POST_COMMENT({ text: commentValue, username: localStorage.getItem('username'), story_id: storyData.story_id, parent_comment_id: 0 })
      .then((response) => {
        setCommentCount(commentCount + 1)
        setSnackBarMessage("Your comment is added!");
        setOpenSnackBar(true);
      }).catch((error) => {
        setSnackBarMessage("Comment can not added!");
        setOpenSnackBar(true);
      });

    const temp = comments;
    temp.push(data);
    setComments(temp);
    setCommentValue("");
  };

  const showAddComment = () => {
    return (

      <Paper style={{ padding: "20px 20px", marginTop: 10 }}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Link href="/">
              <Avatar alt="AT TA" src="" />
            </Link>
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>{localStorage.getItem('username')}</h4>
            <p style={{ textAlign: "left" }}>
              <TextField
                style={{ width: "90%", height: 20 }}
                variant="filled"
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
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
    <Card className={classes.root} elevation={1}>
      <LocationDialog open={openLocation} handleClose={handleCloseLocation} locations={storyData ? storyData.locations : null} />
      <CardHeader
        avatar={
          <Link
            href={storyData ? `/Profile/${storyData.user_id}` : `/Profile`}
          >
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Avatar aria-label="recipe" className={classes.avatar}>
                  {storyData
                    ? storyData.owner_username?.substring(0, 2).toUpperCase()
                    : "?"}
                </Avatar>
              </Grid>
              <Grid>
                <Typography variant="h8" style={{ color: "#000000" }} >{storyData
                  ? storyData.owner_username
                  : "?"}</Typography></Grid></Grid>
          </Link>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={<Typography variant="h5" >{storyData
          ? storyData.title
          : "?"}</Typography>}

        subheader={
          <Grid container columns={2} justifyContent="center" spacing={3}>
            <Grid item columns={2} justifyContent="center" alignItems="center" spacing={3}>
              <Button>
                <DateRange />
                <Typography variant="h10"> {storyDate1} - {storyDate2} </Typography></Button></Grid>
            <Grid item columns={2} alignItems="center" alignItems="center" spacing={3} >
              <Button onClick={handleOpenLocation} style={{ textTransform: 'none' }} >
                {(storyData && storyData.locations && storyData.locations.length > 0)
                  ? (<><LocationOn /><Typography variant="body2">{storyData.locations[0].location.length > 14 ?
                    storyData.locations[0].location.substring(0, 10) + '...'
                    : storyData.locations[0].location}
                  </Typography>
                    {storyData.locations.length > 1 ?
                      (<><ArrowForward />
                        {storyData.locations.length > 2 ?
                          (<><Typography variant="body2">{"+" + (storyData.locations.length - 2)}</Typography>
                            <ArrowForward /></>) : null}
                        <Typography variant="body2">{storyData.locations[storyData.locations.length - 1].location.length > 14 ? storyData.locations[storyData.locations.length - 1].location.substring(0, 10) + '...' : storyData.locations[storyData.locations.length - 1].location}</Typography></>) : null}</>) : ""}
              </Button>
            </Grid>
            
          </Grid>
        }
      >

      </CardHeader>
      {expanded ?
        (<Grid container justifyContent="center" spacing={2} columns = {2}>

          <Grid item xs={11} justifyContent="center" alignContent="center">
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                {storyData ? storyData.text  : ""}
                <div></div>
                {storyData
                  ? storyData.tags.map((item, index) => {
                    return (
                      <Chip
                        className={classes.chip}
                        key={index}
                        onClick={() => console.log("we will add go to tag later")}
                        size="small"
                        label={item}
                      />
                    );
                  })
                  : ""}
              </Typography>
            </CardContent>
          </Grid>
          {storyData ? storyData.multimedias.map((item) => {
          return(<Grid item xs={5}>
            <CardMedia
              className={classes.media}
              image={item }
            />
          </Grid>);}) :null}
          
        </Grid>) : (<Grid container justifyContent="center" ><Grid item xs={11} justifyContent="center" alignContent="center">
          <Typography variant="body2" color="textSecondary" component="p" >
            {storyData ? (expanded ? storyData.text : (storyData.text.substring(0, 500) + "...")) : ""}
            <div></div>
            {storyData
              ? storyData.tags.map((item, index) => {
                return (
                  <Chip
                    className={classes.chip}
                    key={index}
                    onClick={() => console.log("we will add go to tag later")}
                    size="small"
                    label={item}
                  />
                );
              })
              : ""}
          </Typography></Grid> </Grid>)}
          <Typography style={{ textTransform: 'none',textAlign: "right", color: "gray", marginRight:25 }}>
                  {new Date(props.post.createDateTime).toLocaleString('tr-TR')}
                </Typography>


      <CardActions disableSpacing>
        {localStorage.getItem('jwtToken') ?
          <div><Grid container columns={2} alignItems="center" spacing={2}><IconButton
            aria-label="add to favorites"
            color={liked ? "secondary" : ""}
            onClick={handleLike}
          >
            <FavoriteIcon />
          </IconButton>
            <Typography>{likeCount}</Typography></Grid>


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

            <Grid container columns={2} alignItems="center" spacing={2}>
              <IconButton onClick={handleExpandComment}>
                <AddCommentIcon />
              </IconButton><Typography>{commentCount}</Typography>
            </Grid></div> : <div />}
        
        
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          
          <ExpandMoreIcon />
        </IconButton>
        
      </CardActions>
      <Collapse in={expandComment} timeout="auto" unmountOnExit>
        <CardContent>
          <div style={{ padding: 14 }} className="App">
            <h2>Comments</h2>
            {showAddComment()}
            {comments.length === 0? null : <>{comments.map((item, index) => {
              if (item) {
                return (
                  <Comment comment={item} index={index} />
                );
              }
            })}</>}
          </div>
        </CardContent>
      </Collapse>


    </Card>
  );
}
