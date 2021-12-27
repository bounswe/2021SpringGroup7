import React, {Component, useState} from 'react';
import {Text, HStack, Badge, View} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CommentSheet from './CommentSheet';
import {useAuth} from '../../../context/AuthContext';
import {useMutation} from 'react-query';
import {SERVICE} from '../../../services/services';

function LikeAndShare(props) {
  const navigation = useNavigation();
  const { user} = useAuth();
  const [liked, setLiked] = useState(props.data?.is_liked);

  const likeStory = useMutation(params => SERVICE.like({params, token}), {
    onSuccess(response) {
      // console.log(response)
    },
    onError({response}) {
      console.log('res error: ', response);
      setLiked(!liked);
    },
  });

  const like = async () => {
    setLiked(!liked);
    const userInfo = JSON.parse(user?.userInfo);
    token = userInfo.token;
    const data = JSON.stringify({
      user_id: userInfo.user_id,
      story_id: props.data?.story_id,
    });
    try {
      await likeStory.mutateAsync(data, token);
    } catch (e) {
      console.log('e: ', e);
    }
  };
  return (
    <HStack
      alignItems="flex-end"
      display="flex"
      justifyContent="flex-end"
      space={3}
      width={'65%'}>
      <CommentSheet data={props.data?.story_id} own_post={props.data?.own_post}/>
      {!liked ? (
        <Icon name={'heart'} onPress={like} size={20} />
      ) : (
        <Icon name={'heart'} onPress={like} color="red" solid size={20} />
      )}
      <Icon name={'share'} size={20} />
    </HStack>
  );
}

export default LikeAndShare;
