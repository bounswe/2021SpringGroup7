import React from 'react';
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
} from 'native-base';
import  PostingTime   from "../PostCard/SubComponents/PostingTime";

const Comment = props => {
  const colors = ['amber.500', 'purple.500', 'red.500', 'blue.500'];
  const rand = Math.floor(Math.random() * colors.length);
  return (
    <Box ml={4} >
      <HStack space={3}>
        <Avatar
          size="sm"
          bg={colors[rand]}
          ml={-2}
          mt={1}
          elevation={5}
          source={{
            uri: props.data?.username,
          }}></Avatar>
        <Box
          w="80%"
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
          <VStack space={0.3}>
            <Text bold>{props.data?.username}</Text>
            <Text>{props.data?.text}</Text>
            <HStack direction="row-reverse">
            <PostingTime  data={props.data?.date}  fontSize={12}/>

            </HStack>
            {/* <Text textAlign="right"  fontSize={12}>{props.data?.date}</Text> */}
            
          </VStack>
        </Box>
      </HStack>
    </Box>
  );
};

export default Comment;
