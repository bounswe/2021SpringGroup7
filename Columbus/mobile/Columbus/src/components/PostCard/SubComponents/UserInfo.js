import React, {Component} from 'react';
import {
  Box,
  Heading,
  AspectRatio,
  Image,
  Text,
  Center,
  HStack,
  Stack,
  NativeBaseProvider,
  Avatar,
  Tag,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../../context/AuthContext';




function UserInfo(props) {
  const {user} = useAuth();
  const navigation = useNavigation();
  const colors = ['amber.500', 'purple.500', 'red.500', 'blue.500'];
  const rand = Math.floor(Math.random() * colors.length);

  const navigateToProfile=()=>{
  if (user && user.userInfo.username === props.data?.owner_username) {
      return navigation.navigate('ProfilePage', {
        userId: props.data?.user_id,
        username:props.data?.owner_username,
        token:user.userInfo.token,
      });
    } else {
      return navigation.navigate('OtherProfiles', {
        userId: props.data?.user_id,
        username:props.data?.owner_username,
        token:user.userInfo.token,
      });
    
  }
}
  return (
    <HStack space={1} alignItems="center">
      <Avatar
        size="sm"
        bg={colors[rand]}
        ml={-2}
        mt={-2}
        elevation={5}
        source={{
          uri: '${props.data?.photo_url}',
        }}>
        {props.data?.owner_username.substr(0, 2).toUpperCase()}
      </Avatar>
      <Text
        textAlign="center"
        justifyContent="center"
        mb={2}
        bold
        onPress={() => navigateToProfile()}>
        {' '}
        {props.data?.owner_username}{' '}
      </Text>
    </HStack>
  );
}

export default UserInfo;
