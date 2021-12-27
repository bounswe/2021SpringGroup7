import React, {Component} from 'react';
import {Text} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

function LocationInfo(props) {
  const navigation = useNavigation();
  return (
    <Text
      onPress={() => navigation.navigate('Location', {props})}
      fontSize="xs"
      _light={{
        color: 'violet.500',
      }}
      _dark={{
        color: 'violet.400',
      }}
      fontWeight="500"
      ml="-0.5"
      mt="-1">
      {props.data[0]?.location}  {props.data?.length>1 ? + props.data?.length : ''}
    </Text>
  );
}

export default LocationInfo;
