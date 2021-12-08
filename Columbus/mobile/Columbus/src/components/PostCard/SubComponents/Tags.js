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

function Tags(props) {
  const colors= ['green', 'purple', 'red', 'blue', 'amber', 'grey', 'indigo']
  return (
    <HStack space={1} ml={-1}>
        {props.data?.map(item => {
          const rand = Math.floor(Math.random() * colors.length);
          return (
            <Tag size="sm" colorScheme={colors[rand]}>
              {item}
            </Tag>
          );
        })}
      </HStack>
  );
}

export default Tags;


