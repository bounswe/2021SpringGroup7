import React, {Component} from 'react';
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
} from "native-base"
import {NavigationContainer} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';


function CommentSheet(props) {
  const navigation = useNavigation();
  const { isOpen, onOpen, onClose } = useDisclose()
  return (
	  <>
	  <Icon name={'comment'} size={20} onPress={onOpen} />
    <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Box w="100%" h={60} px={4} justifyContent="center">
            <Text
	    textAlign='center'
              fontSize="16"
              color="gray.500"
              _dark={{
                color: "gray.300",
              }}
            >
              Comments
            </Text>
          </Box>
	  <ScrollView>
          

	  </ScrollView>
	 
	  <Input
      
      w={{
        base: "100%",
        md: "25%",
      }}
      variant="outline"
      InputRightElement={
        <Button size="xs" rounded="none" w="1/6" h="full" >
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
