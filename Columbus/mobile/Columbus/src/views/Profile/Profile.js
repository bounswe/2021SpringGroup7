import React from 'react';
import {View, Text} from 'react-native';

const Profile = ({navigation,route}) => {
  return (
    <View>
      <Text>{route?.params?.props?.data?.username}</Text>
      <Text>{route?.params?.props?.data?.img}</Text>
      
    </View>
  );
};

export default Profile;
