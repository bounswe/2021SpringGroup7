import React from 'react'
import {TextField, Snackbar} from '@material-ui/core';

import MessageDialog from '../../components/Dialogs/MessageDialog/MessageDialog'

import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const MapComponent = withScriptjs(withGoogleMap(({setLatitude, setLongitude, ...props}) =>{
    const [marker, setMarker] = React.useState({});

    const handleClick = (e) =>{
        setMarker( {lat: e.latLng.lat(), lng : e.latLng.lng()});
        setLatitude(e.latLng.lat());
        setLongitude(e.latLng.lng());
        
    }
return(<div>
    <GoogleMap
        
        defaultZoom={8}
        defaultCenter={{ lat: 41, lng: 28 }}
   onClick = {handleClick} >
        <Marker  position = {marker} />
    </GoogleMap>
    </div>);
  }
))



class LocationChooser extends React.Component{
    constructor({setLatitude, setLongitude, ...props}){
        super(props);
        this.setLatitude=setLatitude;
        this.setLongitude=setLongitude;
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
                setLatitude= {this.setLatitude}
                setLongitude= {this.setLongitude}
                setParentLocation = {this.setLocations}
                isMarkerShown
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBKOGKEqH_j_aKxoUE46yhNx8XLOFEczaQ&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `500px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                />
        </div>
                
        );
    }

}

export default LocationChooser;
      
       