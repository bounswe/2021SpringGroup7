import React, {Component} from 'react';
import {Text, View} from 'native-base';

function PostTimeInfo(props) {
  console.log(`props`, props)
  return (
    <Text
        fontSize="xs"
        _light={{
          color: 'green.500',
        }}
        _dark={{
          color: 'green.400',
        }}
        fontWeight="500"
        ml="-0.5"
        mt="-1">
        {props.data.date}
      </Text>
  );
}

export default PostTimeInfo;

