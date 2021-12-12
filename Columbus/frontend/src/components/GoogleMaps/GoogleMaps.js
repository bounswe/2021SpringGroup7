import React from 'react'
import {TextField, Snackbar} from '@material-ui/core';

import MessageDialog from '../../components/Dialogs/MessageDialog/MessageDialog'

import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const MapComponent = withScriptjs(withGoogleMap((props) =>{
    const [marker, setMarker] = React.useState({});
    const [latitude,setLatitude] = React.useState('');
    const [longitude,setLongitude] = React.useState('');
    const [message,setMessage] = React.useState('');

    const [ openRegister, setOpenRegister] = React.useState(false);
    const handleCloseRegister = () => {
		  setOpenRegister(false);
		};

    const handleClick = (e) =>{
        setMarker( {lat: e.latLng.lat(), lng : e.latLng.lng()});
        setLatitude(e.latLng.lat());
        setLongitude(e.latLng.lng());
        setMessage("latitude: "+latitude+" longitude: "+longitude);
        setOpenRegister(true);
        
        
    }
return(<div>
    <GoogleMap
        
        defaultZoom={8}
        defaultCenter={{ lat: 41, lng: 28 }}
   onClick = {handleClick} >
        <Marker options={{icon:`https://mt.google.com/vt/icon/psize=16&font=fonts/arialuni_t.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=1`}} position = {marker} />
        <MessageDialog open={openRegister} handleClose={handleCloseRegister} txt={message} />
    </GoogleMap>
    </div>);
  }
))



class LocationChooser extends React.Component{
    constructor(props){
        super(props);

        this.parentHandler = props.parentHandler;
        this.sendParent = this.sendParent.bind(this);

        this.state = {
            selectedLocations: [] // Holds all the locations that are entered by the user
        };

        this.getEditInfo = this.getEditInfo.bind(this);
    }

    getEditInfo(info){
        this.setState({
            selectedLocations : info.locations
        });
    }

    sendParent() {
        {/* Called when user clicks on plus button plcaed below the selected locations.
            It sends all of the entered locations to the parent component (Create Post)*/}
        this.props.parentHandler('locationChooser', this.state.selectedLocations.map((obj) => {
            return [obj['name'], obj['lat'], obj['lng']];
        }))
    }


    setLocations = (locations) => {
        this.setState({
              selectedLocations : locations
          });
    }

    render(){
        return(
          <div style={{ height: '500px', width: '100%' }}>
            <MapComponent 
                setParentLocation = {this.setLocations}
                isMarkerShown
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `500px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                />
        </div>
                
        );
    }

}

export default LocationChooser;
      
       