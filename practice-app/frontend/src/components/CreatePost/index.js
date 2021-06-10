import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { usePlacesWidget } from "react-google-autocomplete";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import api from "../../services/post";
import { Snackbar } from "@material-ui/core";
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CreatePostDialog() {
  const [open, setOpen] = React.useState(false);
  const [imgUrl, setImgUrl] = React.useState(null);
  const [location, setLocation] = React.useState(null);
  const [topic, setTopic] = React.useState("");
  const [story, setStory] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = React.useState("");
  const [selectedDate1, setSelectedDate1] = React.useState(
    new Date("2014-08-18T21:11:54")
  );
  const [selectedDate2, setSelectedDate2] = React.useState(
    new Date("2014-08-18T21:11:54")
  );

  const { ref: materialRef } = usePlacesWidget({
    apiKey: "AIzaSyBMNVI-Aep02o6TwwTechsvSzpRVlA13qo",
    onPlaceSelected: (place) => console.log(place),
    inputAutocompleteValue: "country",
    options: {},
  });

  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };
  const handleDateChange2 = (date) => {
    setSelectedDate2(date);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    const storyData = {
      story: story,
      topic: topic,
      tags: [tags],
      multimedia: [imgUrl],
      owner_username: "atainan",
      storyDate: {
        start: selectedDate1,
        end: selectedDate2,
      },
      location: location,
    };

    api
      .CREATE_POST(storyData)
      .then((resp) => {
        setSnackBarMessage("Post successfully created!");
        setOpenSnackBar(true);
      })
      .catch((error) => {
        setSnackBarMessage("Error! Post is not created!");
        setOpenSnackBar(true);
      });

    // api.CREATE_POST()

    setOpen(false);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarMessage("");
    setOpenSnackBar(false);
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        style={{ width: "90%", margin: "5%", height: 80 }}
        onClick={handleClickOpen}
      >
        Create Story
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        style={{ zIndex: 1 }}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          style={{ width: 450 }}
        >
          Create Story
        </DialogTitle>
        <DialogContent dividers>
          {imgUrl ? (
            <img src={imgUrl} style={{ maxWidth: 500 }}></img>
          ) : (
            <div></div>
          )}
          <Typography gutterBottom>
            <TextField
              id="outlined-basic"
              label="Image Url"
              variant="outlined"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              style={{ width: 500 }}
              multiline
            />
          </Typography>
          <Typography gutterBottom>
            <TextField
              id="outlined-basic"
              label="Topic"
              variant="outlined"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={{ width: 500 }}
            />
          </Typography>
          <Typography gutterBottom>
            <TextField
              id="outlined-basic"
              label="Story"
              variant="outlined"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              style={{ width: 500 }}
              multiline
            />
          </Typography>
          <Typography gutterBottom>
            <TextField
              id="outlined-basic"
              label="Tags"
              variant="outlined"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{ width: 500 }}
              multiline
            />
          </Typography>
          <Typography gutterBottom>
            <TextField
              id="outlined-basic"
              label="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ width: 500 }}
              multiline
            />
          </Typography>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={openSnackBar}
            autoHideDuration={6000}
            onClose={handleCloseSnackBar}
            message={snackBarMessage}
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleCloseSnackBar}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
          {/* <div style={{ width: "250px" }}>
            <span style={{ color: "black" }}>Location</span>

            <Input
              fullWidth
              style={{ marginBottom: 30, zIndex: 100000 }}
              color="primary"
              inputComponent={({ inputRef, onFocus, ...props }) => (
                <Autocomplete
                  apiKey="AIzaSyBMNVI-Aep02o6TwwTechsvSzpRVlA13qo"
                  {...props}
                  onPlaceSelected={(selected) => console.log(selected)}
                  style={{ zIndex: 99999 }}
                />
              )}
            />
          </div> */}
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date picker inline"
              value={selectedDate1}
              onChange={handleDateChange1}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date picker inline"
              value={selectedDate2}
              onChange={handleDateChange2}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            POST
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
