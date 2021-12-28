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
  HStack,
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
  const {user} = useAuth();
  const navigation = useNavigation();
  const {isOpen, onOpen, onClose} = useDisclose();
  const [comments, setComments] = useState([]);
  const [pinnedComments, setPinnedComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentToPost, setCommentToPost] = useState('');
  const [reply, setReply] = useState(null);
  const [refetch, setRefetch] = useState(false);
  let token = '';

  useEffect(() => {
    if (user) {
      getComments();
    } else {
      setLoading(true);
    }
  }, [user, refetch]);

  const refetchCallback = () => {
    setRefetch(!refetch);
  };
  const replyCommentCallback = (id, index, isPinned) => {
    if (isPinned) {
      setReply({
        username: pinnedComments[index].username,
        storyId: pinnedComments[index].id,
      });
    } else {
      setReply({
        username: comments[index].username,
        storyId: comments[index].id,
      });
    }
  };

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

        setCommentToPost('');
        setReply(null);
        setRefetch(!refetch);
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
    token = userInfo.token;
    let data = {};
    if (reply) {
      data = JSON.stringify({
        username: userInfo.username,
        story_id: props.data,
        text: commentToPost,
        parent_comment_id: reply.storyId,
      });
    } else {
      data = JSON.stringify({
        username: userInfo.username,
        story_id: props.data,
        text: commentToPost,
        parent_comment_id: 0,
      });
    }

    try {
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
                        reply={true}
                        pinned={true}
                        data={item}
                        isChild={false}
                        refetchCallback={() => refetchCallback()}
                        key={index}
                        replyCallback={id =>
                          replyCommentCallback(id, index, true)
                        }
                        isPinnable={props.own_post}
                        isDeletable={
                          props.own_post ||
                          item.username == user?.userInfo.username
                        }
                      />
                      {item.child_comments?.length > 0 && (
                        <VStack space={3} mt={5} mb={5} pl="20%">
                          {item.child_comments.map(child_item => {
                            return (
                              <Comment
                                data={child_item}
                                reply={false}
                                isChild={true}
                                key={child_item.id}
                                refetchCallback={() => refetchCallback()}
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
                        reply={true}
                        data={item}
                        isChild={false}
                        key={index}
                        isPinnable={props.own_post}
                        replyCallback={id =>
                          replyCommentCallback(id, index, false)
                        }
                        refetchCallback={() => refetchCallback()}
                        isDeletable={
                          props.own_post ||
                          item.username == user?.userInfo.username
                        }
                      />

                      {item.child_comments?.length > 0 && (
                        <VStack space={3} mt={5} mb={5} pl="20%">
                          {item.child_comments.map(child_item => {
                            return (
                              <Comment
                                reply={false}
                                data={child_item}
                                isChild={true}
                                key={child_item.id}
                                refetchCallback={() => refetchCallback()}
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
            InputLeftElement={
              reply && (
                <Button
                  onPress={() => setReply(null)}
                  variant="ghost"
                  size="xs"
                  rightIcon={<Icon name={'reply'} size={10} />}>
                  Replying to {reply.username}
                </Button>
              )
            }
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
