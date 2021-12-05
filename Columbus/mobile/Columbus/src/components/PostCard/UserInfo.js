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

function UserInfo(props) {
  console.log(props);
  const navigation = useNavigation();
  const colors = ['amber.500', 'purple.500', 'red.500', 'blue.500'];
  const rand = Math.floor(Math.random() * colors.length);
  return (
    <HStack space={1} alignItems="center">
      <Avatar
        size="sm"
        bg={colors[rand]}
        ml={-2}
        mt={-2}
        elevation={5}
        source={{
          uri: 'https://pbs.twimg.com/profile_images/1352844693151731713/HKO7cnlW_400x400.jpg',
        }}>
        {props.data?.username?.substr(0, 2).toUpperCase()}
      </Avatar>
      <Text
        textAlign="center"
        justifyContent="center"
        mb={2}
        bold
        onPress={() => navigation.navigate('Profile', {props})}>
        {' '}
        {props.data?.username}{' '}
      </Text>
    </HStack>
  );
}

export default UserInfo;
