import React, {Component} from 'react';
import {Text} from 'native-base';

export class PostingTime extends Component {
  state = {
    data: [],
  };
  constructor(props) {
    super(props);
    this.state.data = props.data;
  }
  render() {
    return (
      <Text
        color="coolGray.600"
        _dark={{
          color: 'warmGray.200',
        }}
        fontWeight="400">
        {this.state.data}
      </Text>
    );
  }
}

export default PostingTime;
