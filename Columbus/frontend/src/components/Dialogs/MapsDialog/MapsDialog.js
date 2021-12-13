import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import GoogleMaps from "../../GoogleMaps/GoogleMaps.js"
const MapsDialog = ({setLatitude, setLongitude, open, handleClose, txt }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="map"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
        <GoogleMaps setLatitude={setLatitude} setLongitude = {setLongitude} label="map"/>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MapsDialog;
