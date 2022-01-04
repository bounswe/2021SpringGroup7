import React, {Component, useState} from 'react';
import {Text, HStack, Badge, View, Modal, Avatar} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CommentSheet from './CommentSheet';
import {useAuth} from '../../../context/AuthContext';
import {useMutation} from 'react-query';
import {SERVICE} from '../../../services/services';

function LikeAndShare(props) {
  const navigation = useNavigation();
  const {user} = useAuth();
  const [liked, setLiked] = useState(props.data?.is_liked);
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [token, setToken] = useState(user?.userInfo?.token);
  const [likers, setLikers] = useState([]);
  const colors = ['amber.500', 'purple.500', 'red.500', 'blue.500'];
  const rand = Math.floor(Math.random() * colors.length);

  const getLikeStory = useMutation(
    params => SERVICE.getLikes({params, token}),
    {
      onSuccess(response) {
        console.log(response.data);
        setLikers(response.data.return.like);
        setShowLikeModal(true);
      },
      onError({response}) {
        console.log('res error: ', response);
      },
    },
  );

  const getLike = async () => {
    const userInfo = user?.userInfo;
    setToken(userInfo.token);
    // console.log(userInfo)
    const data = props.data?.story_id;

    console.log(data);
    try {
      await getLikeStory.mutateAsync(data, token);
    } catch (e) {
      console.log('e: ', e);
    }
  };

  const likeStory = useMutation(params => SERVICE.like({params, token}), {
    onSuccess(response) {
      // console.log(response);
    },
    onError({response}) {
      console.log('res error: ', response);
      setLiked(!liked);
    },
  });

  const like = async () => {
    setLiked(!liked);
    const userInfo = user?.userInfo;
    setToken(userInfo.token);
    const data = JSON.stringify({
      user_id: userInfo.user_id,
      story_id: props.data?.story_id,
    });
    try {
      await likeStory.mutateAsync(data);
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
      <CommentSheet
        data={props.data?.story_id}
        own_post={props.data?.own_post}
      />
      {!liked ? (
        <Icon
          name={'heart'}
          onPress={() => like()}
          size={20}
          onLongPress={() => getLike()}
        />
      ) : (
        <Icon
          name={'heart'}
          onPress={() => like()}
          color="red"
          solid
          size={20}
          onLongPress={() => getLike()}
        />
      )}
      <Modal isOpen={showLikeModal} onClose={() => setShowLikeModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Who likes</Modal.Header>
          <Modal.Body>
            {likers.map(item => {
              return (
                <HStack ml={3} mt={4} space={1} alignItems="center">
                  <Avatar
                    size="sm"
                    bg={colors[rand]}
                    ml={-2}
                    mt={-2}
                    elevation={5}
                    source={{
                      uri: '${item.photo_url}',
                    }}>
                    {item.username.substr(0, 2).toUpperCase()}
                  </Avatar>
                  <Text
                    textAlign="center"
                    justifyContent="center"
                    mb={2}
                    bold
                    onPress={() => navigation.navigate('Profile', {props})}>
                    {' '}
                    {item.username}{' '}
                  </Text>
                </HStack>
              );
            })}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </HStack>
  );
}

export default LikeAndShare;
