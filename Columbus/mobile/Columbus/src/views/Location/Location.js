import React from 'react';
import {View, Text} from 'react-native';

const Location = ( {navigation,route} ) => {
  console.log(route)
  return (
    <View>
      <Text>{route.params.props.data.name}</Text>
      <Text>{route.params.props.data.longitude}</Text>
      <Text>{route.params.props.data.latitude}</Text>
    </View>
  );
};

export default Location;
