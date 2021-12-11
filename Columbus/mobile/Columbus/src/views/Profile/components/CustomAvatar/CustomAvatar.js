import React from 'react';
import {Avatar} from 'native-base';

const CustomAvatar = props => {
  return (
    <Avatar
      bg="blue.500"
      alignSelf="center"
      size={props.size ? props.size : 'lg'}
      source={{
        uri: `${props.imageUrl}`,
      }}>
      {props.initials}
    </Avatar>
  );
};

export default CustomAvatar;
