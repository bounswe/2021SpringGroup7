import React, {Component,useState} from 'react';
import {Text, HStack, Badge, View} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CommentSheet from './CommentSheet';

function LikeAndShare(props) {
  const navigation = useNavigation();
  const [liked, setLiked] = useState(props.data?.is_liked)


  const like=()=>{
    setLiked(!liked)
    //send post to api
  }
  return (
    <HStack
      alignItems="flex-end"
      display="flex"
      justifyContent="flex-end"
      space={3}
      width={'65%'}>
      <CommentSheet data={props.data} />
      {liked?  <Icon name={'heart'} onPress={like} size={20}/>: <Icon name={'heart'} onPress={like} color="red" solid  size={20}/>}
      <Icon name={'share'} size={20} />
    </HStack>
  );
}

export default LikeAndShare;
