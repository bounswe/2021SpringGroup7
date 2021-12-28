import React, {useState} from 'react';
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
  Avatar,
  HStack,
  VStack,
  Menu,
  Modal,
} from 'native-base';
import {useAuth} from '../../context/AuthContext';
import PostingTime from '../PostCard/SubComponents/PostingTime';
import {Pressable, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CommentMenu from './CommentMenu';

const Comment = props => {
  const [showModal, setShowModal] = useState(false);
  const [modalSize, setModalSize] = useState('sm');
  const { user} = useAuth();
  const colors = ['amber.500', 'purple.500', 'red.500', 'blue.500'];
  const rand = Math.floor(Math.random() * colors.length);

  const reply=(id)=>{
    setShowModal(false)
    props.replyCallback(id)
  }


  return (
    <Box ml={4}  direction='column'>
      <HStack space={3}>
        <Avatar
          size={props?.isChild? "xs" :"sm"}
          bg={colors[rand]}
          ml={-2}
          mt={1}
          elevation={5}
          source={{
            uri: props.data?.photo_url,
          }}>
          {props.data?.username.substring(0, 2).toUpperCase()}
        </Avatar>
        
          <Box
            w="85%"
            rounded="lg"
            overflow="hidden"
            borderColor="coolGray.200"
            borderWidth="1"
            padding={1}
            paddingLeft={3}
            paddingRight={3}
            _dark={{
              borderColor: 'coolGray.600',
              backgroundColor: 'gray.700',
            }}
            _web={{
              shadow: 2,
              borderWidth: 0,
            }}
            _light={{
              backgroundColor: 'gray.50',
            }}>
            <TouchableOpacity onLongPress={() => setShowModal(true)} w="100%">
            <VStack space={0.3}>
                <HStack style={{justifyContent: 'space-between', width: '100%'}}>
                  <Text bold>{props.data?.username}</Text>
                {props.pinned && <Icon name={'map-pin'} style={{marginTop:5}} solid size={10} />}
                </HStack>
                
                
              
              <Text>{props.data?.text}</Text>
              <HStack direction="row-reverse" >
                <PostingTime data={props.data?.date} fontSize={12} />
                
              </HStack>
              {/* <Text textAlign="right"  fontSize={12}>{props.data?.date}</Text> */}
            </VStack>
        </TouchableOpacity>

          </Box>
      </HStack>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        size={modalSize}>
        <Modal.Content maxWidth="400px">
          

          <Modal.Body>
            {props.reply ?
             <CommentMenu replyCallback={()=>reply(props.data.id)} reply={props.reply} data={props?.data} pinned={props.pinned} isDeletable={props.isDeletable} isPinnable={props.isPinnable}></CommentMenu>
             :
             <CommentMenu  reply={props.reply} data={props?.data} pinned={props.pinned} isDeletable={props.isDeletable} isPinnable={props.isPinnable}></CommentMenu>
             }

          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default Comment;
