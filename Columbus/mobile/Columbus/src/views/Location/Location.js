import React, {useState} from 'react';
import {
  View,
  Text,
  Container,
  Heading,
  Box,
  HStack,
  VStack,
  Stack,
  ScrollView,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MapView, {Marker} from 'react-native-maps';


const Location = ( {navigation,route} ) => {
  const [index, setIndex] = useState(0)
  console.log(route.params.props.data,21)

  

  if(route?.params?.props?.data[0].type != 'Virtual'){
    return (<Box
              style={{
                width: '100%',
                padding: 20,
                backgroundColor: '#ffffff',
                height:'100%'
              }}>
              <HStack style={{justifyContent: 'space-between', width: '100%'}}>
                <Icon
                  name={'angle-left'}
                  size={30}
                  onPress={() =>
                    setIndex(index - 1 < 0 ? route?.params?.props?.data.length - 1 : 0)
                  }
                />
                <Heading textAlign="center" m={2}>
                  <Text>{route?.params?.props?.data[index].location}</Text>
                </Heading>
                <Icon
                  name={'angle-right'}
                  size={30}
                  onPress={() => setIndex((index + 1) % route?.params?.props?.data.length)}
                />
              </HStack>

              <MapView
                style={{width: '100%', height: 200}}
                region={{
                  latitude: route?.params?.props?.data[index].latitude,
                  longitude: route?.params?.props?.data[index].longitude,
                  latitudeDelta: 0.3,
                  longitudeDelta: 0.3,
                }}>
                {route?.params?.props?.data.map(loc => {
                  return (
                    <Marker
                      coordinate={{
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                      }}
                      title={loc.location}
                    />
                  );
                })}
              </MapView>
<Heading textAlign="center" m={10}>
                  <Text fontSize={20} >STORIES WILL BE SHOWN HERE </Text>
                </Heading>
              
            </Box>)
  }
  return (<View>
            <Text color="coolGray.600"
      _dark={{
        color: 'warmGray.200',
      }}
      fontWeight="400">
              {route.params.props.data[0].location}
            </Text>
    </View>
  );
};

export default Location;
