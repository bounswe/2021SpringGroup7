import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import InputAdornment from "@material-ui/core/InputAdornment";
import AddLocationIcon from "@material-ui/icons/AddLocation";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import { usePlacesWidget } from "react-google-autocomplete";
import DateFnsUtils from "@date-io/date-fns";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import api from "../../../services/post";
import { Icon, Input, Select, Snackbar } from "@material-ui/core";
import { CircularProgressWithValue } from "../../Progress";
import { Stack } from "@mui/material";

const styles = (theme) => ({
  root: {
    margin: 2,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const filter = createFilterOptions();

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

export default function CreatePostDialog({
  open,
  setOpen,
  locationTypeInit = "",
  locationInit = null,
  topicInit = "",
  storyInit = "",
  tagsInit = [],
  startDateInit = null,
  endDateInit = null,
}) {
  const [imgUrl, setImgUrl] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const [fileData, setFileData] = React.useState(null);
  const [openPreviewDialog, setOpenPreviewDialog] = React.useState(false);
  const [fileUploadProgress, setFileUploadProgress] = React.useState(100);
  const [locationType, setLocationType] = React.useState(locationTypeInit);
  const [location, setLocation] = React.useState(locationInit);
  const [topic, setTopic] = React.useState(topicInit);
  const [story, setStory] = React.useState(storyInit);
  const [tags, setTags] = React.useState(tagsInit);
  const [allTags, setAllTags] = React.useState([{ title: "Hello" }]);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = React.useState("");
  const [startDate, setStartDate] = React.useState(startDateInit);
  const [endDate, setEndDate] = React.useState(endDateInit);

  const { ref } = usePlacesWidget({
    apiKey: "AIzaSyBMNVI-Aep02o6TwwTechsvSzpRVlA13qo",
    onPlaceSelected: (place) => console.log(place),
  });

  const ClearAndClose = () => {
    setOpen(false);
    setLocationType("");
    setLocation(null);
    setTopic("");
    setStory("");
    setTags([]);
    setStartDate(null);
    setEndDate(null);
    setFile(null);
    setFileUploadProgress(0);
  };

  const handleDateChange1 = (date) => {
    setStartDate(date);
  };
  const handleDateChange2 = (date) => {
    setEndDate(date);
  };

  const handleDeleteTag = (tag) => () => {
    console.log("Tags: ")
    console.log(tags)
    setTags(tags.filter((t) => t.title !== tag.title));
  };

  const handlePreview = (event) => {
      setOpenPreviewDialog(true);
  };

  const handlePreviewClose = (event) => {
    setOpenPreviewDialog(false);
};

  const handleLocationTypeChange = (event) => {
    setLocationType(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setFileData(reader.result);
    })

    reader.readAsDataURL(event.target.files[0])
  };

  const handleClose = (event, reason) => {
    console.log(reason);
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      ClearAndClose();
      return;
    }
    const storyData = {
      story: story,
      topic: topic,
      tags: [tags],
      multimedia: [imgUrl],
      owner_username: "atainan",
      storyDate: {
        start: startDate,
        end: endDate,
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

    ClearAndClose();
  };

  const handleCloseSnackBar = (event, reason) => {
    setSnackBarMessage("");
    setOpenSnackBar(false);
  };

  return (
    <>
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
          <Box marginBottom={2}>
            
            <Stack direction="row" spacing={1} sx={{ color: 'text.primary', mfontWeight: 'medium', alignItems: "center", fontSize: 18 }} gutterBottom>
              
              <Typography variant="inherit" noWrap>
                {file ? file.name : "Input File"}
              </Typography>
              {file ? fileUploadProgress !== 100 ? (<CircularProgressWithValue progress={fileUploadProgress}/>) : <Button variant="text" onClick={handlePreview}>Preview</Button> : null}
              <Dialog open={openPreviewDialog} onClose={handlePreviewClose}>
                <img src={fileData}/>
              </Dialog>
              <Button variant="contained" component="label" size='small'>
                Upload File
                <input
                  type="file"
                  accept="image/*, audio/*"
                  onChange={handleFileChange}
                  hidden
                />
              </Button>
            </Stack>
          </Box>

          <Box marginBottom={2}>
            <TextField
              id="outlined-basic"
              label="Topic"
              variant="outlined"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              fullWidth
            />
          </Box>
          <Box marginBottom={2}>
            <TextField
              id="outlined-basic"
              label="Story"
              variant="outlined"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />
          </Box>
          <Box marginBottom={1}>
            <Autocomplete
              multiple
              options={allTags}
              value={tags}
              getOptionLabel={(option) => option.title}
              selectOnFocus
              clearOnBlur
              isOptionEqualToValue = {(option, value) => option.title ===  value.title}
              onChange={(event, newValues) => {
                setTags(
                  newValues.map((newValue) => {
                    if (newValue && newValue.inputValue) {
                      const newTag = {
                        title: newValue.inputValue,
                      };
                      allTags.push(newTag);
                      return newTag;
                    }
                    return {
                      title: newValue.title,
                    };
                  })
                );
                setAllTags(allTags);
              }}
              filterOptions={(options, params) => {
                
                const filtered = filter(options, params);
                
                const { inputValue } = params;

                const isExisting = options.some(
                  (option) => inputValue === option.title
                );
                if (inputValue !== "" && !isExisting) {
                  filtered.push({
                    inputValue,
                    title: `Add "${inputValue}"`,
                  });
                }
                return filtered;
              }}
              renderTags={() => null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Tags"
                />
              )}
            />
          </Box>
          {<Grid container spacing={1} marginBottom={1} columns={{xs: 2}}>
              {tags.map((tag) => (
              <Grid item xs="auto">
                <Chip
                key={tag.title}
                
                label={tag.title}
                
                onDelete={handleDeleteTag(tag)}
              />
              </Grid>
            ))}
            </Grid>}
          <Box marginBottom={2}>
            <FormControl fullWidth>
              <InputLabel id="location-type-id">Location Type</InputLabel>
              <Select
                variant="standard"
                value={locationType}
                onChange={handleLocationTypeChange}
                label="Location Type"
              >
                <MenuItem value={"Virtual"}>Virtual</MenuItem>
                <MenuItem value={"Real"}>Real</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {locationType ? (
            locationType === "Virtual" ? (
              <Box marginBottom={2}>
                <TextField
                  id="outlined-basic"
                  label="Location"
                  variant="outlined"
                  //inputRef={ref}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  fullWidth
                />
              </Box>
            ) : (
              <Box marginBottom={2}>
                <TextField
                  id="outlined-basic"
                  label="Location"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton size="small" edge="end">
                          <AddLocationIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                    ref: { ref },
                  }}
                  //  value={location}
                  //  onChange={(e) => setLocation(e.target.value)}
                  fullWidth
                />
              </Box>
            )
          ) : null}

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date picker inline"
              value={startDate}
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
              value={endDate}
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
    </>
  );
}
