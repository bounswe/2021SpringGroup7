import React, {Component} from 'react';
import {Text, HStack} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CommentSheet from './CommentSheet';

function LikeAndShare(props) {
  const navigation = useNavigation();
  return (
    <HStack
      alignItems="flex-end"
      display="flex"
      justifyContent="flex-end"
      space={5}
      width={'65%'}>
      <CommentSheet data={props.data} />
      <Icon name={'heart'} size={20} />
      <Icon name={'share'} size={20} />
    </HStack>
  );
}

export default LikeAndShare;
