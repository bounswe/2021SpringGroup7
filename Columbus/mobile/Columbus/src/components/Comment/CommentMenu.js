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
  TextArea
} from 'native-base';
import PostingTime from '../PostCard/SubComponents/PostingTime';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useAuth} from '../../context/AuthContext';

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
  const [checkMenu,setCheckMenu ] = useState(false);

  

  if(showEditMenu){
    return(<>
          <TextArea variant="outline" value={props.data.text} />
          <Button variant='ghost' colorScheme="blue" > Update Comment</Button>
          <Button variant='ghost' colorScheme="red" > Cancel</Button>

        </>)
  }
  if(checkMenu){
    return(<>
    <Icon name={'exclamation-triangle'}  color="red" solid size={35} style={{alignSelf:'center',margin:1}} />
      <Text  bold textColor='red' m={3} style={{color:'red',textAlign:'center'}}>

        This Action Cannot Be Undone
      </Text>
      <Text bold m={3} mt={-1} style={{textAlign:'center'}}>
        Are you sure you want to delete this comment
      </Text>
      <Button  colorScheme="red"  ml={6} mr={6}> DELETE</Button>
      <Button variant="ghost" colorScheme="red">
          CANCEL
        </Button>
    </>)
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
        <Button variant="ghost" colorScheme="blue">
          {props.pinned ? 'Unpin' : 'Pin'}
        </Button>
      )}
      {editable ? (
        <Button
          variant="ghost"
          onPress={()=>setShowEditMenu(true)}
          colorScheme="blue">
          Edit
        </Button>
      ) : (
        <Button variant="ghost" colorScheme="red">
          Report
        </Button>
      )}
      {deletable && (
        <Button variant="ghost"
         onPress={()=>setCheckMenu(true)}
         colorScheme="red">
          Delete
        </Button>
      )}
    </>
  );
};

export default CommentMenu;
