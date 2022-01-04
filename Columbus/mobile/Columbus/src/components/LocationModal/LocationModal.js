import React, {useState} from 'react';
import {View} from 'react-native';
import {Button, Modal, Text} from 'native-base';
import MapView, {Marker} from 'react-native-maps';

const DateFormModal = props => {
  const [latitude, setLatitude] = useState(41.0768);
  const [longitude, setLongitude] = useState(29.0219);
  const [marker, setMarker] = useState(null);
  const [region, setRegion] = useState({
    latitude: 41.0768,
    longitude: 29.0219,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });

  const handleSaveDate = () => {
    const locationData = {
      latitude,
      longitude,
    };

    props.handleSaveDate(locationData);
  };
  const setLocation = loc => {
    setLatitude(loc.latitude);
    setLongitude(loc.longitude);
    setMarker(loc);
  };

  const zoomIn =()=>{
    let newRegion={...region}
    newRegion.latitudeDelta-=0.2*newRegion.latitudeDelta
    newRegion.longitudeDelta-=0.2*newRegion.longitudeDelta
    setRegion(newRegion)

  }
  const zoomOut =()=>{
    let newRegion={...region}
    newRegion.latitudeDelta+=0.2*newRegion.latitudeDelta
    newRegion.longitudeDelta+=0.2*newRegion.longitudeDelta
    setRegion(newRegion)

  }

  return (
    <View>
      <Modal isOpen={props.showModal} onClose={props.onClose}>
        <Modal.Content width={'100%'} height={'100%'}>
          <Modal.CloseButton />
          <Modal.Header>Choose Location</Modal.Header>
          <Modal.Body>
            <MapView
              style={{width: '100%', height: 500, margin: 0}}
              region={region}
              onPress={e => setLocation(e.nativeEvent.coordinate)}
              onRegionChangeComplete={e => setRegion(e)}>
              {marker !== null && (
                <Marker
                  draggable
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                  }}
                  title={'location'}
                />
              )}
              
            </MapView>
            <View style={{position: 'absolute', bottom: '20%', left: '5%'}}>
                <Button
                  m={2}

                  onPress={() =>
                    zoomIn()
                  }
                >
                  Zoom In
                </Button>
                <Button
                  m={2}
                  onPress={() => {
                    zoomOut();
                  }}
                >
                  Zoom Out
                </Button>
              </View>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={props.onClose}>
                Cancel
              </Button>
              <Button onPress={handleSaveDate}>Save</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
};

export default DateFormModal;
