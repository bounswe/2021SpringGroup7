import React from "react";
import TextField from "@material-ui/core/TextField";


export default function VirtualLocationField({location, onChangeName}) {


    return (
    <TextField
      id="outlined-basic"
      label="Location Name"
      variant="outlined"
      value={location ? location.locationName : null}
      onChange={onChangeName}
      placeholder="Please enter the name of the location"
      fullWidth
      required
    />);
}