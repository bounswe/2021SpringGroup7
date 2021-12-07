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

export class Tags extends Component {
  state = {
    data: [],
    colors: ['green', 'purple', 'red', 'blue', 'amber', 'grey', 'indigo'],
  };
  constructor(props) {
    super(props);
    this.state.data = props.data;
  }
  render() {
    return (
      <HStack space={1} ml={-1}>
        {this.state.data.map(item => {
          const rand = Math.floor(Math.random() * this.state.colors.length);
          return (
            <Tag size="sm" colorScheme={this.state.colors[rand]}>
              {item}
            </Tag>
          );
        })}
      </HStack>
    );
  }
}

export default Tags;
