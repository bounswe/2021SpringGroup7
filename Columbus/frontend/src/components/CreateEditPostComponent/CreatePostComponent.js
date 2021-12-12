import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
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
import api from "../../services/post";
import { Select, Snackbar } from "@material-ui/core";
import { CircularProgressWithValue } from "../Progress";
import { Stack } from "@mui/material";
import { RealLocationField, VirtualLocationField } from "../LocationFields";
import ImagePreviewBox from "../Preview/ImagePreview/ImagePreviewBox";

const filter = createFilterOptions();

export default function CreatePostDialog({
  imgUrlInit = "",
  locationTypeInit = null,
  locationInit = [],
  topicInit = "",
  storyInit = "",
  tagsInit = [],
  startDateInit = null,
  endDateInit = null,
}) {
  const [imgUrl, setImgUrl] = React.useState(imgUrlInit);
  const [file, setFile] = React.useState(null);
  const [fileData, setFileData] = React.useState(null);
  const [openPreviewDialog, setOpenPreviewDialog] = React.useState(false);
  const [fileUploadProgress, setFileUploadProgress] = React.useState(0);
  const [locationType, setLocationType] = React.useState(locationTypeInit);
  const [locations, setLocations] = React.useState(locationInit);
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

  const handleDateChange1 = (date) => {
    setStartDate(date);
  };
  const handleDateChange2 = (date) => {
    setEndDate(date);
  };

  const handleDeleteTag = (tag) => () => {
    console.log("Tags: ");
    console.log(tags);
    setTags(tags.filter((t) => t.title !== tag.title));
  };

  const handlePreview = (event) => {
    setOpenPreviewDialog(true);
  };

  const handlePreviewClose = (event) => {
    setOpenPreviewDialog(false);
  };

  const handleLocationTypeChange = (event) => {
    var newLocation = [];
    if (event.target.value === "Real") {
      newLocation.push({ locationName: null, geolocation: null });
    } else {
      newLocation.push({ locationName: null });
    }
    setLocationType(event.target.value);
    setLocations(newLocation);
  };

  const handleLocationNameChange = (index) => (event) => {
    let newLocations = [...locations];
    let item = {...locations[index]}
    item.locationName = event.target.value;
    newLocations[index] = item;
    setLocations(newLocations);
  };

  const handleLocationCoordinatesChange = (index) => (event) => {
    
    let newLocations = [...locations];
    let item = {...locations[index]}
    item.geolocation = {"latitude": 10, "longitude" : 10};
    newLocations[index] = item;
    setLocations(newLocations);
  };

  const handleLocationDelete = (index) => () => {
    setLocations(locations.filter((location, i) => index !== i));
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    if(event.target.files[0]){
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      console.log(reader.result)
      setFileData(reader.result);
    });

    reader.readAsDataURL(event.target.files[0]);
    }else {
      setFileData(null);
    }
  };

  const addEmptyLocation = () => {
    setLocations(locations.concat({ locationName: null, geolocation: null }));
  };

  const handlePost = e => {
    e.preventDefault();
    console.log(startDate)
    const storyData = {
      text: story,
      title: topic,
      tags: tags,
      multimedia: imgUrl,
      time_start: startDate,
      time_end: endDate,
      location: locationType==="Virtual" ? locations.map((location) => ({"location": location.locationName, "latitude": null, "longitude": null, "type": locationType})) : locations.map((location) => ({"location": location.locationName, "latitude": location.geolocation.latitude, "longitude": location.geolocation.longitude, "type": locationType})),
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
  };

  const handleCloseSnackBar = () => {
    setSnackBarMessage("");
    setOpenSnackBar(false);
  };

  return (
    <form onSubmit={handlePost}>
      <Stack direction="column" spacing={2} padding={10} paddingTop={2}>
      <Box paddingBottom={2}><Typography variant="h4">Create New Story</Typography></Box>
      <ImagePreviewBox imageData={fileData}/>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            color: "text.primary",
            mfontWeight: "medium",
            alignItems: "center",
            fontSize: 18,
          }}
        >
          
          <Typography variant="inherit" noWrap>
            {file ? file.name : "Input File"}
          </Typography>
          {file ? (
            fileUploadProgress !== 100 ? (
              <CircularProgressWithValue progress={fileUploadProgress} />
            ) : (
              <Button variant="text" onClick={handlePreview}>
                Preview
              </Button>
            )
          ) : null}
          <Dialog open={openPreviewDialog} onClose={handlePreviewClose}>
            <img src={fileData} />
          </Dialog>
          <Button variant="contained" component="label" size="small">
            Upload File
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </Button>
        </Stack>
        <TextField
          id="outlined-basic"
          label="Topic"
          variant="outlined"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          fullWidth
          required
        />
        <TextField
          id="outlined-basic"
          label="Story"
          variant="outlined"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          multiline
          rows={4}
          fullWidth
          required
        />
        <Autocomplete
          multiple
          options={allTags}
          value={tags}
          getOptionLabel={(option) => option.title}
          selectOnFocus
          clearOnBlur
          isOptionEqualToValue={(option, value) => option.title === value.title}
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
            <TextField {...params} variant="outlined" placeholder="Tags" />
          )}
        />
        {
          <Grid container spacing={1} marginBottom={1} columns={{ xs: 2 }}>
            {tags.map((tag) => (
              <Grid item xs="auto">
                <Chip
                  key={tag.title}
                  label={tag.title}
                  onDelete={handleDeleteTag(tag)}
                />
              </Grid>
            ))}
          </Grid>
        }
        <FormControl fullWidth>
          <InputLabel id="locationName-type-id">Location Type</InputLabel>
          <Select
            variant="standard"
            value={locationType}
            onChange={handleLocationTypeChange}
            label="Location Type"
            required
          >
            <MenuItem value={"Virtual"}>Virtual</MenuItem>
            <MenuItem value={"Real"}>Real</MenuItem>
          </Select>
        </FormControl>
        {locationType ? (
          locationType === "Virtual" ? (
            <VirtualLocationField
            location={locations[0]}
            onChangeName={handleLocationNameChange(0)}
            />
          ) : (
            locations.map((location, index) => {
              return (
                <>
                  <RealLocationField
                    location={location}
                    onChangeName={handleLocationNameChange(index)}
                    onChangeData={handleLocationCoordinatesChange(index)}
                    removeLocation={handleLocationDelete(index)}
                    showDelete={locations.length !== 1}
                  />

                  {index === 2 ? null : index === locations.length - 1 ? (
                    <Box>
                      <IconButton
                        size="medium"
                        aria-label="addlocations"
                        color="inherit"
                        onClick={addEmptyLocation}
                      >
                        <AddIcon fontSize="medium" />
                      </IconButton>
                      <Typography> Add location</Typography>
                    </Box>
                  ) : null}
                </>
              );
            })
          )
        ) : null}
        
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Stack spacing={2} direction='row' justifyContent='space-around'>
          <Box>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="yyyy-mm-dd"
            placeholder="YYYY-mm-dd"
            margin="normal"
            id="date-picker-inline"
            label="Start Date"
            value={startDate}
            onChange={handleDateChange1}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          </Box>
          <Box>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="yyyy-mm-dd"
              margin="normal"
              id="date-picker-inline"
              label="End Date"
              value={endDate}
              onChange={handleDateChange2}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </Box>
         </Stack>
        </MuiPickersUtilsProvider>
        
        <Box>
        <Button type='submit' size='large' color="primary"  variant="contained">
          POST
        </Button>
        </Box>
      </Stack>
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
    </form>
  );
}
