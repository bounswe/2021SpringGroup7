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
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddCommentIcon from "@material-ui/icons/AddComment";
import CloseIcon from "@material-ui/icons/Close";

import api from "../../services/post";
// import SimpleMap from "../Map/index";

const imgLink =
  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "90%",
    borderRadius: 10,
    margin: "5%",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
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
    backgroundColor: red[500],
  },
}));

export default function PostCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [storyData, setStoryData] = useState(null);
  const [commentValue, setCommentValue] = useState("");
  const [comments, setComments] = useState([]);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    api
      .GET_POST(props.props.id)
      .then((resp) => {
        setStoryData(resp);
      })
      .catch((error) => alert(error));
    api
      .GET_COMMENTS(props.props.id)
      .then((resp) => {
        setComments([
          resp[0],
          resp[1],
          resp[2],
          resp[3],
          resp[4],
          resp[5],
          resp[6],
          resp[7],
          resp[8],
        ]);
      })
      .catch((error) => alert(error));
  }, [props.props.id]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLike = () => {
    api
      .LIKE_POST({ postId: storyData.id, username: "atainan" })
      .then((response) => {
        setSnackBarMessage(response.message);
        setOpenSnackBar(true);
        setLiked(!liked);
      })
      .catch((error) => alert(error));
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarMessage("");
    setOpenSnackBar(false);
  };

  const handleComment = () => {
    let formdata = new FormData();
    formdata.append("text", commentValue);
    api
      .COMMENT_POST({
        postId: storyData.id,
        username: "atainan",
        comment: formdata,
      })
      .then((response) => {
        if (response.success) {
          setSnackBarMessage("Yorumunuz ba??ar??yla eklendi!");
        } else {
          setSnackBarMessage("Yorumunuz eklenirken bir hata olu??tu!");
        }
        setOpenSnackBar(true);
      });
    setExpanded(true);
    const data = {
      comment: commentValue,
      username: "atainan",
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
            <Link href="/profile/atainan">
              <Avatar alt="AT TA" src="" />
            </Link>
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>atainan</h4>
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
      <CardHeader
        avatar={
          <Link
            href={`/profile/${storyData ? storyData.owner_username : null}`}
          >
            <Avatar aria-label="recipe" className={classes.avatar}>
              {storyData
                ? storyData.owner_username?.substring(0, 2).toUpperCase()
                : "?"}
            </Avatar>
          </Link>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={storyData ? storyData.topic : ""}
        subheader={
          storyData
            ? storyData.storyDate.start.substring(0, 17) +
              " - " +
              storyData.storyDate.end.substring(0, 17)
            : " "
        }
      />
      <CardMedia
        className={classes.media}
        image={storyData ? storyData.multimedia[0] : ""}
        title="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {storyData ? storyData.story : ""}
          <div></div>
          {storyData
            ? storyData.tags.map((item, index) => {
                return (
                  <Chip
                    key={index}
                    onClick={() => console.log("we will add go to tag later")}
                    color="secondary"
                    size="small"
                    label={item}
                  />
                );
              })
            : ""}
        </Typography>
      </CardContent>
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
        <IconButton onClick={(e) => setExpanded(true)}>
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
      <Collapse in={expanded} timeout="auto" unmountOnExit>
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
          {/* <SimpleMap></SimpleMap> */}
        </CardContent>
      </Collapse>
    </Card>
  );
}
