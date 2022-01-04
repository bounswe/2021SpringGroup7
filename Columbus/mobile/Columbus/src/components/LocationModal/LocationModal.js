import React, {useState} from 'react';
import {View} from 'react-native';
import {Button, Modal} from 'native-base';
import MapView, {Marker} from 'react-native-maps';

const DateFormModal = props => {
  const [latitude, setLatitude] = useState(41.0768);
  const [longitude, setLongitude] = useState(29.0219);

  const handleSaveDate = () => {
    const locationData = {
      latitude,
      longitude,
    };

    props.handleSaveDate(locationData);
  };

  return (
    <View>
      <Modal isOpen={props.showModal} onClose={props.onClose}>
        <Modal.Content width={'100%'} height={'100%'}>
          <Modal.CloseButton />
          <Modal.Header>Choose Location</Modal.Header>
          <Modal.Body>
            {/* <MapView
              region={{
                latitude,
                longitude,
                latitudeDelta: 0.3,
                longitudeDelta: 0.3,
              }}>
              <Marker
                coordinate={{
                  latitude: latitude,
                  longitude: longitude,
                }}
                title={'location'}
              />
            </MapView> */}
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
