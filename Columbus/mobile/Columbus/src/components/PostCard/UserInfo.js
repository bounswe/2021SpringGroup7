import React, {Component} from 'react';
import {
  Box,
  Heading,
  AspectRatio,
  Image,
  Text,
  Center,
  HStack,
  Stack,
  NativeBaseProvider,
  Avatar,
  Tag,
} from 'native-base';

export class UserInfo extends Component {
  state = {
    data: [],
    colors:['amber.500','purple.500','red.500','blue.500']
  }
  constructor (props) {
    super (props);
    this.state.data = props.data;
    console.log(props)
  }
  render () {
    const rand=Math.floor(Math.random() * this.state.colors.length) 
    return (
      <HStack space={1} alignItems="center">
        <Avatar
          size="sm"
          bg={this.state.colors[rand]}
          ml={-2}
          mt={-2}
          elevation={5}
          source={{
            uri: 'https://pbs.twimg.com/profile_images/1352844693151731713/HKO7cnlW_400x400.jpg',
          }}
        >
          {this.state.data?.username?.substr(0,2).toUpperCase()}
        </Avatar>
        <Text textAlign="center" justifyContent="center" mb={2} bold>
          {' '}{this.state.data?.username}{' '}
        </Text>
      </HStack>
    );
  }
}

export default UserInfo;
