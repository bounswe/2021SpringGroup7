import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import { usePlacesWidget } from "react-google-autocomplete";
import DateFnsUtils from "@date-io/date-fns";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useNavigate  } from "react-router-dom";
import {UploadImage} from '../../config/s3Api';

import { v4 as uuidv4 } from 'uuid';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import api from "../../services/post";
import { Select } from "@material-ui/core";
import { LinearProgressWithValue } from "../Progress";
import { Stack } from "@mui/material";
import { RealLocationField, VirtualLocationField } from "../LocationFields";
import ImagePreviewBox from "../Preview/ImagePreview/ImagePreviewBox";

const filter = createFilterOptions();

export default function CreatePostDialog({
  imgUrlInit = "",
  locationTypeInit = null,
  dateTypeInit ="",
  locationInit = [],
  topicInit = "",
  storyInit = "",
  tagsInit = [],
  startDateInit = null,
  endDateInit = null,
  setSnackBarMessage,
  setOpenSnackBar,
}) {
  const guid = uuidv4();
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = React.useState(imgUrlInit);
  const [file, setFile] = React.useState(null);
  const [fileUploadProgress, setFileUploadProgress] = React.useState(0);
  const [locationType, setLocationType] = React.useState(locationTypeInit);
  const [dateType, setDateType] = React.useState(dateTypeInit);
  const [dateTypeList, setDateTypeList] = React.useState([]);
  const [locations, setLocations] = React.useState(locationInit);
  const [errorIndex, setErrorIndex] = React.useState(null);
  const [topic, setTopic] = React.useState(topicInit);
  const [decade, setDecade] = React.useState("2020s");
  const [century, setCentury] = React.useState("19.");
  const [story, setStory] = React.useState(storyInit);
  const [tags, setTags] = React.useState(tagsInit);
  const [allTags, setAllTags] = React.useState([{ title: "Hello" }]);
  const [startDate, setStartDate] = React.useState(startDateInit);
  const [startDateDict, setStartDateDict] = React.useState(null);
  const [endDate, setEndDate] = React.useState(endDateInit);
  const [endDateDict, setEndDateDict] = React.useState(null);
  const { ref } = usePlacesWidget({
    apiKey: "AIzaSyBMNVI-Aep02o6TwwTechsvSzpRVlA13qo",
    onPlaceSelected: (place) => console.log(place),
  });
  const handleDateTypeChange = (date) => {
    if(date.target.value=="Day" || date.target.value=="Start-End Day"){
      setDateTypeList(["year","month","day"])
    }
    else if(date.target.value == "Month" || date.target.value=="Start-End Month"){
      setDateTypeList(["year","month"])
    }
    else if(date.target.value=="Year" || date.target.value=="Start-End Year")
      setDateTypeList(["year"])
    setDateType(date.target.value);
      
  };
  const handleDecade = (date) =>{
    setDecade(date.target.value);
    setStartDateDict({type:"decade",date: date.target.value});
  }
  const handleCentury = (date) =>{
    setCentury(date.target.value);
    setStartDateDict({type:"century",date: date.target.value});
  }
  const handleDateChange1 = (date) => {
    if(date==null)
      return;
    if(date.getFullYear())
      var year = date.getFullYear();
    var month = null;
    var day =null
    if(dateTypeList.length>=2){
        month = date.getMonth()+1;}
    if(dateTypeList.length==3){
        day= date.getDate();}
    const var1 ={type:"specific",year: year,month: month,day: day,hour: null,minute: null};
    setStartDate(date);
    setStartDateDict(var1);
  };
  const handleDateChange2 = (date) => {
    if(date==null)
      return;
    if(date.getFullYear())
      var year = date.getFullYear();
    var month = null;
    var day =null
    if(dateTypeList.length>=2){
      month = date.getMonth()+1;}
    if(dateTypeList.length==3){
        day= date.getDate();}
    const var1 ={type:"specific",year: year,month: month,day: day,hour: null,minute: null};
    setEndDate(date);
    setEndDateDict(var1);
  };

  const handleDeleteTag = (tag) => () => {
    setTags(tags.filter((t) => t.title !== tag.title));
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
      console.log(event.target.files[0])
        UploadImage(guid, event.target.files[0], setImgUrl, setFileUploadProgress)
    }else {
      setFile(null);
    }
  };

  const addEmptyLocation = () => {
    setLocations(locations.concat({ locationName: null, geolocation: null }));
  };

  const handlePost = e => {
    e.preventDefault();

    if(locationType === "Real"){
      if(!locations.every((location, index) => location.geolocation ? true : setErrorIndex(index))){
        return;
      }
    }
    const storyData = {
      text: story,
      title: topic,
      tags: tags.map((tag) => tag.title),
      username: localStorage.getItem("username"),
      multimedia: [imgUrl],
      time_start: startDateDict,
      time_end: endDateDict,
      location: locationType==="Virtual" ? locations.map((location) => ({"location": location.locationName, "latitude": 0, "longitude": 0, "type": locationType})) : locations.map((location) => ({"location": location.locationName, "latitude": location.geolocation.latitude, "longitude": location.geolocation.longitude, "type": locationType})),
    };

    api
      .CREATE_POST(storyData)
      .then((resp) => {
        setSnackBarMessage("Post successfully created!");
        setOpenSnackBar(true);
        navigate("/Home")
      })
      .catch((error) => {
        setSnackBarMessage("Error! Post is not created!");
        setOpenSnackBar(true);
      });
  };

  return (
    <form onSubmit={handlePost}>
      <Stack direction="column" spacing={2} padding={10} paddingTop={2}>
      <Box paddingBottom={2}><Typography variant="h4">Create New Story</Typography></Box>
      <ImagePreviewBox imageData={imgUrl}/>
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
        
          {file ?
            fileUploadProgress !== 100 ? (
              <LinearProgressWithValue progress={fileUploadProgress} />
            ) : null
           : null}
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
                    isError={index === errorIndex}
                    setIsError={setErrorIndex}
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
        <FormControl fullWidth>
          <InputLabel id="date-type">Date Type</InputLabel>
          <Select
            variant="standard"
            value={dateType}
            onChange={handleDateTypeChange}
            label="Date Type"
            required
          >
            <MenuItem value={"Century"}>Century</MenuItem>
            <MenuItem value={"Decade"}>Decade</MenuItem>
            <MenuItem value={"Year"}>Year</MenuItem>
            <MenuItem value={"Month"}>Month</MenuItem>
            <MenuItem value={"Day"}>Day</MenuItem>
            <MenuItem value={"Start-End Year"}>Start-End Year</MenuItem>
            <MenuItem value={"Start-End Month"}>Start-End Month</MenuItem>
            <MenuItem value={"Start-End Day"}>Start-End Day</MenuItem>
          </Select>
        </FormControl>
        
        {dateType.substring(0,9)=="Start-End"? (<MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Stack spacing={2} direction='row' justifyContent='space-around'>
          <Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          openTo="year"
          views={dateTypeList}
          label="Date picker"
          value={startDate}
          onChange={handleDateChange1}
          renderInput={(params) => <TextField {...params} helperText={null} />}
            required
            maxDate={endDate ? endDate : Date.now()}
            minDateMessage="Start date can't be after than end date"
          /></LocalizationProvider>
          </Box>
          <Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          openTo="year"
          views={dateTypeList}
          label="Date picker"
          value={endDate}
          onChange={handleDateChange2}
          renderInput={(params) => <TextField {...params} helperText={null} />}
              required
              minDate={startDate ? startDate : new Date("1800-01-01")}
              maxDate={Date.now()}
              minDateMessage="End date can't be before than start date"
            /></LocalizationProvider>
          </Box>
         </Stack>
        </MuiPickersUtilsProvider>) : <>{dateType=="Decade"? <FormControl fullWidth >
          <InputLabel id="decade" >Decade</InputLabel>
          <Select
            variant="standard"
            value={decade}
            onChange={handleDecade}
            label="Decade"
            required
          >
            <MenuItem value={180}>1800s</MenuItem>
            <MenuItem value={181}>1810s</MenuItem>
            <MenuItem value={182}>1820s</MenuItem>
            <MenuItem value={183}>1830s</MenuItem>
            <MenuItem value={184}>1840s</MenuItem>
            <MenuItem value={185}>1850s</MenuItem>
            <MenuItem value={186}>1860s</MenuItem>
            <MenuItem value={187}>1870s</MenuItem>
            <MenuItem value={188}>1880s</MenuItem>
            <MenuItem value={189}>1890s</MenuItem>
            <MenuItem value={190}>1900s</MenuItem>
            <MenuItem value={191}>1910s</MenuItem>
            <MenuItem value={192}>1920s</MenuItem>
            <MenuItem value={193}>1930s</MenuItem>
            <MenuItem value={194}>1940s</MenuItem>
            <MenuItem value={195}>1950s</MenuItem>
            <MenuItem value={196}>1960s</MenuItem>
            <MenuItem value={197}>1970s</MenuItem>
            <MenuItem value={198}>1980s</MenuItem>
            <MenuItem value={199}>1990s</MenuItem>
            <MenuItem value={200}>2000s</MenuItem>
            <MenuItem value={201}>2010s</MenuItem>
            <MenuItem value={202}>2020s</MenuItem>
          </Select>
        </FormControl>:<>{dateType=="Century"? <FormControl fullWidth >
          <InputLabel id="century" >Century</InputLabel>
          <Select
            variant="standard"
            value={century}
            onChange={handleCentury}
            label="Century"
            required
          >
            <MenuItem value={10}>10.</MenuItem>
            <MenuItem value={11}>11.</MenuItem>
            <MenuItem value={12}>12.</MenuItem>
            <MenuItem value={13}>13.</MenuItem>
            <MenuItem value={14}>14.</MenuItem>
            <MenuItem value={15}>15.</MenuItem>
            <MenuItem value={16}>16.</MenuItem>
            <MenuItem value={17}>17.</MenuItem>
            <MenuItem value={18}>18.</MenuItem>
            <MenuItem value={19}>19.</MenuItem>
            <MenuItem value={20}>20.</MenuItem>
          </Select>
        </FormControl>:<MuiPickersUtilsProvider utils={DateFnsUtils}> <Box>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          openTo="year"
          views={dateTypeList}
          label="Date picker"
          value={startDate}
          onChange={handleDateChange1}
          renderInput={(params) => <TextField {...params} helperText={null} />}
          minDate={new Date("1800-01-01")}
          maxDate={Date.now()}
        /></LocalizationProvider>
          </Box></MuiPickersUtilsProvider>}</>}</>}
        {errorIndex !==null ? <Typography>Please select a location on map for location {errorIndex+1}</Typography> : null}
        <Box>
        <Button type='submit' size='large' color="primary"  variant="contained">
          POST
        </Button>
        </Box>
      </Stack>
    </form>
  );
}
