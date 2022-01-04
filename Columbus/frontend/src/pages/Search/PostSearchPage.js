import * as React from "react";
import { useSearchParams } from "react-router-dom";
import GoogleMapsWithClustering from "../../components/GoogleMaps/GoogleMapsWithClustering";
import Post from "../../components/Post/Post";
import Wrapper from "../../components/Wrapper";
import POST_SERVICE from "../../services/post";
import { Stack } from "@mui/material";
import SearchIcon from "@material-ui/icons/Search";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";

import MenuItem from "@material-ui/core/MenuItem";
import { Paper, Select, makeStyles, Typography, Chip, CircularProgress } from "@material-ui/core";

const filterSectionRowStyle = {
  "margin-left": "5%",
  "margin-right": "5%",
  "margin-top": "2%",
  "margin-bottom": "2px",
};

const filterSectionColStyle = {
  background: "#FFFFFF",
  "padding-bottom": "10px"
};
const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#FFFFF"
  }
}));


export function getMaxDayByYearAndMonth(year, month){
  switch(month){
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 2:
      return year%4 === 0 ? 29 : 28
    default:
      return 30;
  }
}

export function getNewDate(searchParams, dateType){
  let dateData = "";
  if (dateType === "specific") {
    dateData = {
      startDate: {
        year: parseInt(searchParams.get("startYear")),
        month: parseInt(searchParams.get("startMonth")),
        day: parseInt(searchParams.get("startDay"))
      },
      endDate: {
        year: parseInt(searchParams.get("endYear")),
        month: parseInt(searchParams.get("endMonth")),
        day: parseInt(searchParams.get("endDay"))
      },
    };
  } else if (dateType === "decade") {
    if (searchParams.get("date")) {
      dateData = parseInt(searchParams.get("date")) * 10 + "s";
    }
  }else if(dateType){
    if (searchParams.get("date")) {
      dateData = parseInt(searchParams.get("date"));
    }
  }
  return dateData;
}

export default function PostSearchPage() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [allStories, setAllStories] = React.useState([]);
  const [curStories, setCurStories] = React.useState([]);
  const [geolocation, setGeolocation] = React.useState({lat: searchParams.get("lat") ? parseFloat( searchParams.get("lat")) : null, lng: searchParams.get("lng") ? parseFloat(searchParams.get("lng")) : null});
  const [distance, setDistance] = React.useState(searchParams.get("distance") ? parseInt(searchParams.get("distance")) : 30);
  const searchText = searchParams.get("searchText") ? searchParams.get("searchText") : "";
  const [locationType, setLocationType] = React.useState(
    searchParams.get("locationType") ? searchParams.get("locationType") : ""
  );
  const [locationName, setLocationName] = React.useState(
    searchParams.get("locationName") ? searchParams.get("locationName") : "" 
  );
  const [dateType, setDateType] = React.useState(
    searchParams.get("dateType") ? searchParams.get("dateType") : ""
  );
  const [tagText, setTagText] = React.useState("");
  const [tags, setTags] = React.useState(searchParams.get("tags") ? searchParams.get("tags").split('|') : [])
  const [isLoading, setIsLoading] = React.useState(true);

  const [date, setDate] = React.useState(getNewDate(searchParams, dateType));
  React.useEffect(() => {
    setDate(getNewDate(searchParams, dateType))
  }, [dateType])
  

  
  const handleLocationNameChange = (event) => {
    setLocationName(event.target.value);
  };

  const handleLocationTypeChange = (event) => {
    const filtered = allStories.filter(story => story.locations.some(location => location.type===event.target.value))
    setCurStories(filtered)
    setLocationType(event.target.value);
  };

  const handleDateTypeChange = (event) => {
    const type = event.target.value;
    if (type === "specific") {
      setDate({
        startDate: {
          year: null,
          month: null,
          day: null
        },
        endDate: {
          year: null,
          month: null,
          day: null
        },
      });
    }else {
      setDate("")
    }
    setDateType(type);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleStartYearChange = (event) => {
    let newDate = {...date}
    newDate.startDate.year = parseInt(event.target.value)
    setDate(newDate);
  };

  const handleStartMonthChange = (event) => {
    let newDate = {...date}
    newDate.startDate.month = parseInt(event.target.value)
    setDate(newDate);
  };

  const handleStartDayChange = (event) => {
    let newDate = {...date}
    newDate.startDate.day = parseInt(event.target.value)
    setDate(newDate);
  };

  const handleEndYearChange = (event) => {
    let newDate = {...date}
    newDate.endDate.year = parseInt(event.target.value)
    setDate(newDate);
  };


  const handleEndMonthChange = (event) => {
    let newDate = {...date}
    newDate.endDate.month = parseInt(event.target.value)
    setDate(newDate);
  };

  const handleEndDayChange = (event) => {
    let newDate = {...date}
    newDate.endDate.day = parseInt(event.target.value)
    setDate(newDate);
  };

  const handleAddTag = (event) => {
    setTags(tags.concat(tagText))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setIsLoading(true);
  };

  const handleCurrentLocation = () => {
    if ( locationType === "Real") {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            setGeolocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          function (error) {
            console.error("Error Code = " + error.code + " - " + error.message);
          }
        );
      } else {
        console.log("Not Available");
      }
    }
  }

  const handleDistanceChange = (e) => {
      setDistance(parseInt(e.target.value))
  }

  const search = () => {
    let searchData ={
      "search_text": searchText,  
      "location_text": locationName,
      "search_date_type": dateType,
    }

    if(tags.length > 0 ){
      searchData.tags = tags
    }

    if(geolocation.lat && geolocation.lng){
       searchData.query_latitude= geolocation.lat
       searchData.query_longitude= geolocation.lng
       searchData.query_distance= distance
    }

    if(dateType==="specific"){
      if(date.startDate.year){
        searchData.search_year_start = date.startDate.year
      }

      if(date.startDate.month){
        searchData.search_month_start = date.startDate.month
      }
      if(date.startDate.day){
        searchData.search_day_start = date.startDate.day
      }
      
      if(date.endDate.year){
        searchData.search_year_end= date.endDate.year
      }

      if(date.endDate.month){
        searchData.search_month_end= date.endDate.month
      }
      
      if(date.endDate.day){
        searchData.search_day_end= date.endDate.day
      }
      
    }else {
      if(date){
        const intVal = parseInt(date)
        searchData.search_date = dateType === "decade" ? intVal/10 : intVal
      }
    }
    POST_SERVICE.SEARCH(searchData, localStorage.getItem("username")).then((response) => {
      setAllStories(response.data.return);
      setCurStories(response.data.return);
      setIsLoading(false);
    });
  }

  React.useEffect(() => {
    search()
  }, [isLoading]);
  
  return (
    <Wrapper searchValue={searchText}>
      <Paper className={useStyles.root} elevation={4} square>
        <form onSubmit={handleSearch}>
          <Stack direction="column" style={filterSectionColStyle}>
            <Stack
              direction="row"
              style={filterSectionRowStyle}
              justifyContent="space-between"
              spacing={2}
            >
              <Select
                variant="standard"
                value={locationType}
                onChange={handleLocationTypeChange}
                label="Location Type"
              >
                <MenuItem value={"Virtual"}>Virtual</MenuItem>
                <MenuItem value={"Real"}>Real</MenuItem>
              </Select>
              <TextField
                id="outlined-basic"
                label="Location Name"
                variant="outlined"
                value={locationName}
                onChange={handleLocationNameChange}
                placeholder="Please enter the name of the location"
              />
              <Button
                variant="contained"
                size="medium"
                endIcon={<SearchIcon />}
                type="submit"
              >
                Search
              </Button>
            </Stack>
            <Stack
              direction="row"
              style={filterSectionRowStyle}
              spacing={2}
            >
              <Select
                variant="standard"
                value={dateType}
                onChange={handleDateTypeChange}
                label="Date Type"
                displayEmpty
              >
                <MenuItem value={"century"}>Century</MenuItem>
                <MenuItem value={"decade"}>Decade</MenuItem>
                <MenuItem value={"specific"}>Specific</MenuItem>
              </Select>
              {dateType === "century" ? (
                <Select
                  variant="standard"
                  value={date}
                  onChange={handleDateChange}
                  label="Century"
                  displayEmpty
                  autoWidth
                >
                  {[
                    ...Array(Math.floor(new Date().getFullYear() / 100) + 1).keys(),
                  ].map((value) => (
                    <MenuItem value={value}>{value * 100}s</MenuItem>
                  ))}
                </Select>
              ) : dateType === "decade" ? (
                <TextField
                id="outlined-basic"
                label="Decade"
                variant="outlined"
                value={date}
                onChange={handleDateChange}
                inputProps={{ pattern: "\\d{1,3}0s" }}
                placeholder="1960s"
                />
              ) : dateType === "specific" ? (
                <Stack direction="column" spacing={1}>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      id="outlined-basic-start-year"
                      label="Start Year"
                      type="number"
                      variant="outlined"
                      value={date.startDate ? date.startDate.year : null}
                      onChange={handleStartYearChange}
                      inputProps={{min: 0, max: date.endDate.year ? date.endDate.year : new Date().getFullYear()}}
                      placeholder="Please enter the start year"
                      required
                    />
                    {date.startDate.year ? <TextField
                      id="outlined-basic-start-year"
                      label="Start Month"
                      type="number"
                      variant="outlined"
                      value={date.startDate ? date.startDate.month : null}
                      onChange={handleStartMonthChange}
                      inputProps={{min: 1, max: date.endDate.year === date.startDate.year ? date.endDate.month : 12 }}
                      placeholder="Please enter the start month"
                    /> : null}
                    {date.startDate.month ? <TextField
                      id="outlined-basic-start-day"
                      label="Start Day"
                      type="number"
                      variant="outlined"
                      value={date.startDate ? date.startDate.day : null}
                      onChange={handleStartDayChange}
                      inputProps={{min: 1, max: date.endDate.year === date.startDate.year && date.endDate.month === date.startDate.month ? date.endDate.day : getMaxDayByYearAndMonth(date.startDate.year, date.startDate.month)}}
                      placeholder="Please enter the start day"
                    /> : null}
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      id="outlined-basic-start-year"
                      label="End Year"
                      type="number"
                      variant="outlined"
                      value={date.endDate ? date.endDate.year : null}
                      onChange={handleEndYearChange}
                      inputProps={{min: date.startDate.year, max: new Date().getFullYear()}}
                      placeholder="Please enter the end year"
                    />
                    {date.endDate.year ? <TextField
                      id="outlined-basic-start-year"
                      label="End Month"
                      type="number"
                      variant="outlined"
                      value={date.endDate ? date.endDate.month : null}
                      onChange={handleEndMonthChange}
                      inputProps={{min: date.endDate.year === date.startDate.year ? date.startDate.month : 1, max: 12 }}
                      placeholder="Please enter the end month"
                    /> : null}
                    {date.endDate.month ? <TextField
                      id="outlined-basic-start-day"
                      label="End Day"
                      type="number"
                      variant="outlined"
                      value={date.endDate ? date.endDate.day : null}
                      onChange={handleEndDayChange}
                      inputProps={{min: date.endDate.year === date.startDate.year && date.endDate.month === date.startDate.month ? date.endDate.day : 1, max: getMaxDayByYearAndMonth(date.endDate.year, date.endDate.month)}}
                      placeholder="Please enter the end day"
                    /> : null}
                  </Stack>
                </Stack>
              ) : null}
            </Stack>
            {locationType === "Real" ? 
                <Stack
                direction="row"
                style={filterSectionRowStyle}
                spacing={2}
              >
                <TextField
                  id="outlined-basic"
                  label="Latitude"
                  variant="outlined"
                  value={geolocation.lat ? geolocation.lat.toFixed(3) : ""}
                  placeholder="Latitude"
                  disabled
                />
                <TextField
                  id="outlined-basic"
                  label="Longitude"
                  variant="outlined"
                  value={geolocation.lng ? geolocation.lng.toFixed(3) : ""}
                  placeholder="Longitude"
                  disabled
                />
                <TextField
                    id="outlined-basic"
                    type="number"
                    label="Distance (km)"
                    variant="outlined"
                    value={distance}
                    onChange={handleDistanceChange}
                    placeholder="Distance in km"
                />
                <Button
                  variant="contained"
                  size="medium"
                  onClick={handleCurrentLocation}
                  startIcon={<MyLocationIcon />}
                  
                >
                 Current Location
                </Button>
                
              </Stack>
              : null
            }
             <Stack
                direction="row"
                style={filterSectionRowStyle}
                spacing={2}
              >
                <TextField
                  id="outlined-basic"
                  label="Tag"
                  variant="outlined"
                  value={tagText}
                  onChange={(e) => setTagText(e.target.value)}
                  placeholder="Tag"
                />
                <Button
                  variant="contained"
                  size="medium"
                  onClick={handleAddTag}
                >
                  Add Tag
                </Button>
                {tags.map((tag, i) => <Chip label={tag} onDelete={() => setTags(tags.filter((val, index) => index!==i))}/>)}
              </Stack>
          </Stack>
        </form>
      </Paper>
      {locationType === "Real" ? 
        <GoogleMapsWithClustering
          key={allStories}
          center={geolocation}
          stories={allStories}
          setStories={setCurStories}
          setGeolocation={setGeolocation}
        />
       : null}
      {isLoading ? <CircularProgress>Loading...</CircularProgress> : curStories.length>0 ? curStories.map((story) => (
        <Post post={story} /> 
      )): <Typography>Could not found any stories matching the search criteria...</Typography>}
    </Wrapper>
  );
}
