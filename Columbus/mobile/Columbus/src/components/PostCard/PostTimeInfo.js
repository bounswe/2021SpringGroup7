import React, { Component } from 'react'
import { Text, View } from 'native-base'

export class PostTimeInfo extends Component {
   state = {
    data: [],
  }
  constructor (props) {
    super (props);
    this.state.data = props.data;
    console.log(props)
  }
	render() {
		return (
			 <Text
            fontSize="xs"
            _light={{
              color: "green.500",
            }}
            _dark={{
              color: "green.400",
            }}
            fontWeight="500"
            ml="-0.5"
            mt="-1"
          >
            {this.state.data}
          </Text>
		)
	}
}

export default PostTimeInfo
