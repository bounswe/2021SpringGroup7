import React, {Component} from 'react';
import {Text} from 'native-base';

function PostingTime(props) {
  return (
    <Text
      color="coolGray.600"
      _dark={{
        color: 'warmGray.200',
      }}
      fontWeight="400">
      {props.data}
    </Text>
  );
}

export default PostingTime;
