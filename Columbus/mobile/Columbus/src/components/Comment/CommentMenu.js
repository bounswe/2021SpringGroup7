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
} from 'native-base';
import PostingTime from '../PostCard/SubComponents/PostingTime';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useAuth} from '../../context/AuthContext';


const CommentMenu = props => {
  const { user} = useAuth();
  const [editable, setEditable] = useState(props?.data?.username ==user?.userInfo?.username)
  const [reportable, setReportable] = useState(!(props?.data?.username == user?.userInfo?.username))
  const [deletable, setDeletable] = useState(props.isDeletable)
  const [pinable, setPinable] = useState(props.isPinnable)


  
  return (<>
              {pinable&&<Button variant="ghost" colorScheme="blue">{props.pinned?'Unpin':'Pin'}</Button>}
              {editable? <Button variant="ghost" colorScheme="blue">Edit</Button>:<Button variant="ghost" colorScheme="red">Report</Button>}
              {deletable&&<Button variant="ghost" colorScheme="red">Delete</Button>}
	    </>
  )
};

export default CommentMenu;
