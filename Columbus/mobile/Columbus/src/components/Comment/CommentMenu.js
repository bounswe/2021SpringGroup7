import React, {useState} from 'react';
import {
  Button,
  Text,
  Box,
  Center,
  NativeBaseProvider,
  Input,
  Avatar,
  HStack,
  VStack,
  Menu,
  TextArea,
} from 'native-base';
import PostingTime from '../PostCard/SubComponents/PostingTime';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useAuth} from '../../context/AuthContext';
import {SERVICE} from '../../services/services';
import {useMutation} from 'react-query';

const CommentMenu = props => {
  const {user} = useAuth();
  const [editable, setEditable] = useState(
    props?.data?.username == user?.userInfo?.username,
  );
  const [reportable, setReportable] = useState(
    !(props?.data?.username == user?.userInfo?.username),
  );
  const [deletable, setDeletable] = useState(props.isDeletable);
  const [pinable, setPinable] = useState(props.isPinnable);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [checkMenu, setCheckMenu] = useState(false);
  const [token, setToken] = useState(user?.userInfo?.token)
  const [editCommentValue, setEditCommentValue] = useState(props.data.text)

  

  const editComment = useMutation(
    params => SERVICE.editComment({params, token}),
    {
      onSuccess(response) {
        props.closeCallBack();
        setCheckMenu(false)
      },
      onError({response}) {
        console.log('res error: ', response);
      },
    },
  );
  const handleEditComment = async () => {
    const token = user?.userInfo?.token;
    setToken(token)
    const data = JSON.stringify({
      comment_id: props.data.id,
      text:editCommentValue
    });
    try {
      await editComment.mutateAsync(data,token);
    } catch (e) {
      console.log('e: ', e);
    }
  };

  const pinComment = useMutation(
    params => SERVICE.pinComment({params, token}),
    {
      onSuccess(response) {
        props.closeCallBack();
        setCheckMenu(false)
      },
      onError({response}) {
        console.log('res error: ', response);
      },
    },
  );
  const handlePinComment = async () => {
    const token = user?.userInfo?.token;
    setToken(token)
    const data = JSON.stringify({
      comment_id: props.data.id,
      story_id: props.data.story_id
    });
    try {
      console.log(data,token)
      await pinComment.mutateAsync(data,token);
    } catch (e) {
      console.log('e: ', e);
    }
  };





  const deleteComment = useMutation(
    params => SERVICE.deleteComment({params, token}),
    {
      onSuccess(response) {
        props.closeCallBack();
        setCheckMenu(false)
      },
      onError({response}) {
        console.log('res error: ', response);
      },
    },
  );
  const handleDeleteComment = async () => {
    const token = user?.userInfo?.token;
    setToken(token)
    const data = JSON.stringify({
      comment_id: props.data.id,
    });
    try {
      await deleteComment.mutateAsync(data,token);
    } catch (e) {
      console.log('e: ', e);
    }
  };
  if (showEditMenu) {
    return (
      <>
        <TextArea variant="outline" value={editCommentValue} onChangeText={value => setEditCommentValue(value)}/>
        <Button variant="ghost" colorScheme="blue" onPress={()=>handleEditComment()}>
          {' '}
          Update Comment
        </Button>
        <Button variant="ghost" colorScheme="red">
          {' '}
          Cancel
        </Button>
      </>
    );
  }
  if (checkMenu) {
    return (
      <>
        <Icon
          name={'exclamation-triangle'}
          color="red"
          solid
          size={35}
          style={{alignSelf: 'center', margin: 1}}
        />
        <Text
          bold
          textColor="red"
          m={3}
          style={{color: 'red', textAlign: 'center'}}>
          This Action Cannot Be Undone
        </Text>
        <Text bold m={3} mt={-1} style={{textAlign: 'center'}}>
          Are you sure you want to delete this comment
        </Text>
        <Button
          colorScheme="red"
          ml={6}
          mr={6}
          onPress={() => handleDeleteComment()}>
          
          DELETE
        </Button>
        <Button
          variant="ghost"
          colorScheme="red"
          onPress={() => props.closeCallBack()}>
          CANCEL
        </Button>
      </>
    );
  }

  return (
    <>
      {props.reply && (
        <Button
          variant="ghost"
          colorScheme="blue"
          onPress={() => {
            props.replyCallback();
          }}>
          Reply
        </Button>
      )}
      {pinable && (
        <Button variant="ghost" colorScheme="blue" onPress={()=>handlePinComment()}>
          {props.pinned ? 'Unpin' : 'Pin'}
        </Button>
      )}
      {editable ? (
        <Button
          variant="ghost"
          onPress={() => setShowEditMenu(true)}
          colorScheme="blue">
          Edit
        </Button>
      ) : (
        <Button variant="ghost" colorScheme="red">
          Report
        </Button>
      )}
      {deletable && (
        <Button
          variant="ghost"
          onPress={() => setCheckMenu(true)}
          colorScheme="red">
          Delete
        </Button>
      )}
    </>
  );
};

export default CommentMenu;
