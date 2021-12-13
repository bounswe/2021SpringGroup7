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
import LocationDialog from '../Dialogs/PostLocationDialog/PostLocationDialog'
import { createTheme, ThemeProvider } from '@mui/material/styles';

import api from "../../services/post";

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
  chip : {
    backgroundColor: "#007c3b",
    color : "white"
  }
}));

export default function Post(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [expandComment, setExpandComment] = useState(false);
  const [storyData, setStoryData] = useState(null);
  const [curUser, setCurUser] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [comments, setComments] = useState([]);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [liked, setLiked] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);


  useEffect(() => {
    setStoryData(props.post);
    setCurUser(props.curUser);
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
    setSnackBarMessage("");
    setOpenSnackBar(false);
  };

  const handleLike = () => {
    setOpenSnackBar(true);
    setLiked(!liked);
  };
  const handleOpenLocation = () => {
    setOpenLocation(true);
  };
  const handleCloseLocation = () => {
    setOpenLocation(false);
  };


  const handleComment = () => {
    let formdata = new FormData();
    formdata.append("text", commentValue);
    setExpandComment(true);

    const data = {
      comment: commentValue,
      username: localStorage.getItem('username'),
      date: "10 seconds ago",
    };

    const temp = comments;
    temp.push(data);
    setComments(temp);
    setCommentValue("");
  };

  const showAddComment = () => {
    return (

      <Paper style={{ padding: "40px 20px", marginTop: 30 }}>
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
                style={{ width: "90%" }}
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
            href={`/`}
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
                <Typography variant="h10"> {storyData
                  ? storyData.time_start.substring(0, 14) +
                  " - " +
                  storyData.time_end.substring(0, 14)
                  : " "} </Typography></Button></Grid>
            <Grid item columns={2} alignItems="center" alignItems="center" spacing={3} >
              <Button onClick={handleOpenLocation} style={{ textTransform: 'none' }} >
                {storyData
                  ? (<><LocationOn /><Typography variant="body2">{storyData.locations[0].location}</Typography>
                    {storyData.locations.length > 1 ?
                      (<><ArrowForward />
                        {storyData.locations.length > 2 ?
                          (<><Typography variant="body2">{"+" + (storyData.locations.length - 2)}</Typography>
                            <ArrowForward /></>) : null}
                        <Typography variant="body2">{storyData.locations[storyData.locations.length - 1].location}</Typography></>) : null}</>) : ""}
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
          {storyData ? storyData.multimedia.map((item) => {
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



      <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          color={liked ? "secondary" : ""}
          onClick={handleLike}
        >
          <FavoriteIcon />
        </IconButton>


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

        <IconButton onClick={(e) => setExpandComment(!expandComment)}>
          <AddCommentIcon />
        </IconButton>

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
            <h1>Comments</h1>
            {showAddComment()}
            {comments.map((item, index) => {
              if (item) {
                return (
                  <Paper
                    key={index}
                    style={{ padding: "40px 20px", marginTop: 100 }}
                  >
                    <Grid container wrap="nowrap" spacing={2}>
                      <Grid item>
                        <Avatar alt={item.username} src="" />
                      </Grid>
                      <Grid justifyContent="left" item xs zeroMinWidth>
                        <h4 style={{ margin: 0, textAlign: "left" }}>
                          {item.username}
                        </h4>
                        <p style={{ textAlign: "left" }}>{item.comment}</p>
                        <p style={{ textAlign: "left", color: "gray" }}>
                          {item.date}
                        </p>
                      </Grid>
                    </Grid>
                  </Paper>
                );
              }
            })}
          </div>
        </CardContent>
      </Collapse>


    </Card>
  );
}
