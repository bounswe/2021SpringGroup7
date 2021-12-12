import React from "react";
import TextField from "@material-ui/core/TextField";
import { Button, IconButton } from "@material-ui/core";
import { Stack } from "@mui/material";
import DeleteIcon from "@material-ui/icons/Delete";
import AddLocationIcon from "@material-ui/icons/AddLocation";
import EditLocationIcon from "@material-ui/icons/EditLocation";
import { Box } from "@mui/system";


export default function RealLocationField({location, onChangeName, onChangeData, removeLocation, showDelete}) {
    const [mapOpen, setMapOpen] = React.useState(false);
    

    const handleMapDialogOpen = () => {
        location.geolocation = {"latitude": 10, "longitude": 10}
        setMapOpen(!mapOpen);
    }

    return (
       <Stack direction='row' spacing={1}>
    <TextField
      id="outlined-basic"
      label="Location Name"
      variant="outlined"
      value={location.locationName ? location.locationName : null}
      onChange={onChangeName}
      placeholder="Please enter the name of the location"
      fullWidth
      required
    />
    <Button variant="contained" size='large' color="inherit" style={{'minWidth': 250}} endIcon={location.geolocation ? <EditLocationIcon /> : <AddLocationIcon />} onClick={handleMapDialogOpen}>
            {location.geolocation ? "Edit from map" : "Select From map"}
    </Button>
    {showDelete ? <Box><IconButton
        size="medium"
        aria-label="deleteLocation"
        color="inherit"
        onClick={removeLocation}
        disableRipple
        disableFocusRipple
      >
                <DeleteIcon fontSize="medium" />
      </IconButton></Box>: null  }
   
    {/*<GoogleMap></GoogleMap>*/}
  </Stack>);
}