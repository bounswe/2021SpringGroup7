import React, {Component, useState, useEffect} from 'react';
import {
  Button,
  Actionsheet,
  useDisclose,
  Text,
  Box,
  Center,
  NativeBaseProvider,
  ScrollView,
  Input,
  VStack,
  View,
  Spinner,
} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Comment from '../../Comment';
import {useAuth} from '../../../context/AuthContext';
import {SERVICE} from '../../../services/services';
import moment from 'moment';

import {useMutation} from 'react-query';

function CommentSheet(props) {
  const { user} = useAuth();
  const navigation = useNavigation();
  const {isOpen, onOpen, onClose} = useDisclose();
  const [comments, setComments] = useState([]);
  const [pinnedComments, setPinnedComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentToPost, setCommentToPost] = useState('');
  let token = '';

  useEffect(() => {
    if (user) {
      getComments();
    } else {
      setLoading(true);
    }
  }, [user]);

  const fetchComments = useMutation(
    params => SERVICE.fetchComments({params, token}),
    {
      onSuccess(response) {
        setComments(response.data.return.comments);
        setPinnedComments(response.data.return.comments);
      },
      onError({response}) {
        console.log('res error: ', response);
      },
    },
  );

  const getComments = async () => {
    const userInfo = user?.userInfo;
    token = userInfo.token;
    const data = JSON.stringify({
      story_id: props.data,
    });
    try {
      await fetchComments.mutateAsync(data, token);
    } catch (e) {
      console.log('e: ', e);
    }
  };

  const commentOnPost = useMutation(
    params => SERVICE.commentOnPost({params, token}),
    {
      onSuccess(response) {
        const {username} = user?.userInfo;
        updated_comments = [
          ...comments,
          {
            date: moment().format(`YYYY-MM-DDTHH:mm:ss.sssZ`).toString(),
            text: commentToPost,
            username: username,
          },
        ];
        setComments(updated_comments);
        setCommentToPost('');
      },
      onError({response}) {
        console.log('res error: ', response);
      },
    },
  );

  const handleClick = async () => {
    if (commentToPost == '') {
      return;
    }
    const userInfo = user?.userInfo;
    console.log(user);
    token = userInfo.token;
    const data = JSON.stringify({
      username: userInfo.username,
      story_id: props.data,
      text: commentToPost,
    });
    try {
      console.log(data);
      await commentOnPost.mutateAsync(data, token);
    } catch (e) {
      console.log('e: ', e);
    }
  };

  if (loading == true) {
    <View
      style={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Spinner />
    </View>;
  }

  return (
    <>
      <Icon name={'comment'} size={20} onPress={onOpen} />
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Box w="100%" maxH={80} px={4} justifyContent="center">
            <Text
              textAlign="center"
              fontSize="16"
              color="gray.500"
              _dark={{
                color: 'gray.300',
              }}>
              Comments
            </Text>
            <ScrollView width="100%">
              <VStack space={3} mt={5} mb={5}>
                {pinnedComments.map((item, index) => {
                  return (
                    <View style={{display: 'flex', flexDirection: 'column'}}>
                      <Comment
                        pinned={true}
                        data={item}
                        isChild={false}
                        key={index}
                        isPinnable={props.own_post}
                        isDeletable={
                          props.own_post ||
                          item.username == user?.userInfo.username
                        }
                      />
                      {item.child_comments?.length > 0 && (
                        <VStack space={3} mt={5} mb={5} pl="20%">
                          {item.child_comments.map(child_item => {
                            console.log(child_item, 'child');
                            return (
                              <Comment
                                data={child_item}
                                isChild={true}
                                key={child_item.id}
                                isPinnable={false}
                                isDeletable={
                                  props.own_post ||
                                  child_item.username == user?.userInfo.username
                                }
                              />
                            );
                          })}
                        </VStack>
                      )}
                    </View>
                  );
                })}

                {comments.map((item, index) => {
                  return (
                    <View style={{display: 'flex', flexDirection: 'column'}}>
                      <Comment
                        data={item}
                        isChild={false}
                        key={index}
                        isPinnable={props.own_post}
                        isDeletable={
                          props.own_post ||
                          item.username == user?.userInfo.username
                        }
                      />

                      {item.child_comments?.length > 0 && (
                        <VStack space={3} mt={5} mb={5} pl="20%">
                          {item.child_comments.map(child_item => {
                            console.log(child_item, 'child');
                            return (
                              <Comment
                                data={child_item}
                                isChild={true}
                                key={child_item.id}
                                isPinnable={false}
                                isDeletable={
                                  props.own_post ||
                                  child_item.username == user?.userInfo.username
                                }
                              />
                            );
                          })}
                        </VStack>
                      )}
                    </View>
                  );
                })}
              </VStack>
            </ScrollView>
          </Box>
          <ScrollView></ScrollView>

          <Input
            w={{
              base: '100%',
              md: '25%',
            }}
            variant="outline"
            value={commentToPost}
            onChangeText={value => setCommentToPost(value)}
            InputRightElement={
              <Button
                size="xs"
                onPress={handleClick}
                rounded="none"
                w="1/6"
                h="full">
                Comment
              </Button>
            }
            placeholder="Comment.."
          />
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}

export default CommentSheet;
