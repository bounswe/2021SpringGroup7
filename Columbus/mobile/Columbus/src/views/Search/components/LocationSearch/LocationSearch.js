import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {
  Avatar,
  Button,
  FormControl,
  ScrollView,
  Actionsheet,
  useDisclose,
} from 'native-base';
import CustomFormInput from '../../../../components/CustomFormInput';
import {SERVICE} from '../../../../services/services';
import {useAuth} from '../../../../context/AuthContext';
import {useMutation} from 'react-query';
import getInitials from '../../../../utils/getInitial';
import {styles} from './LocationSearch.style';
import PageSpinner from '../../../../components/PageSpinner/PageSpinner';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Entypo';
import DetailedPost from '../../../DetailedPost';

const getGeoLocation = () => {
  const config = {
    enableHighAccuracy: true,
    timeout: 9000,
    maximumAge: 3600000,
  };

  Geolocation.getCurrentPosition(
    info => {
      setUserLoc;
    },
    error => console.log('ERROR', error),
    config,
  );
  return info;
};
const colors= ['green', 'purple', 'red', 'blue', 'grey', 'indigo']

const LocationSearch = props => {
  const {user} = useAuth();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [startLocation, setStartLocation] = useState({
    latitude: 41.07678,
    longitude: 29.021877,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [disableSearchButton, setDisableSearchButton] = useState(false);
  const {isOpen, onOpen, onClose} = useDisclose();
  const [clickedPost, setClickedPost] = useState(null);
  const getGeoLocation = () => {
    const config = {
      enableHighAccuracy: true,
      timeout: 9000,
      maximumAge: 3600000,
    };

    Geolocation.getCurrentPosition(
      info => {
        setUserLocation(info.coords);
      },
      error => console.log('ERROR', error),
      config,
    );
  };

  if (!userLocation) {
    getGeoLocation();
  }
  const handleSearchThisArea = () => {
    setDisableSearchButton(true);
    getPostsHandle();
  };

  const getPosts = useMutation(
    params => SERVICE.getSearch(params, user.userInfo.token),
    {
      onSuccess(response) {
        setSearchResult(response.data.return);
        setDisableSearchButton(false);
        setIsLoading(false);
      },
      onError({response}) {
        setIsLoading(false);
        console.log('res error res12: ', response);
      },
    },
  );
  const getPostsHandle = async () => {
    setIsLoading(true);
    const data = JSON.stringify({
      page_number: 1,
      page_size: 10,
      max_latitude: startLocation.latitude + startLocation.latitudeDelta,
      max_longitude: startLocation.longitude + startLocation.longitudeDelta,
      min_latitude: startLocation.latitude + -startLocation.latitudeDelta,
      min_longitude: startLocation.longitude - startLocation.longitudeDelta,
    });

    try {
      await getPosts.mutateAsync(data);
    } catch (e) {
      setIsLoading(false);
      console.log('err: ', e);
    }
  };
  const handleMarkerClick = post => {
    setClickedPost(post);
    onOpen();
  };

  return (
    <View style={{flex: 1, padding: 0}}>
      <MapView
        style={{width: '100%', height: '100%', margin: 0}}
        region={startLocation}
        onRegionChangeComplete={e => setStartLocation(e)}>
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="YOU"
            // image={{uri: user.photo_url }}
          >
            <Icon
              name={'man'}
              color="#ff8c00"
              light
              size={35}
              onLongPress={() => getLike()}
            />
          </Marker>
        )}
        {searchResult?.map(item => {
          const rand = Math.floor(Math.random() * colors.length);
          return item.locations.map(loc=>
          {
            return <Marker
              key={loc.location}
              coordinate={{
                longitude: loc.longitude,
                latitude: loc.latitude,
              }}
              pinColor={colors[rand]}
              onPress={() => handleMarkerClick(item)}></Marker>
          }
            
          )
          
        })}
      </MapView>
      <View style={{ position: 'absolute', bottom: 20, left: 2 }}>
      <Button
        m={2}

        onPress={() =>
          setStartLocation({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          })
        }>
        Where Am I
      </Button>
      <Button
        m={2}
        onPress={() => {
          handleSearchThisArea();
        }}
        isDisabled={disableSearchButton}>
        Search This Area
      </Button>
      </View>
      <>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <DetailedPost
              route={{params: {postData: clickedPost}}} dontShowMap={true}></DetailedPost>
          </Actionsheet.Content>
        </Actionsheet>
      </>
    </View>
  );
};

export default LocationSearch;
