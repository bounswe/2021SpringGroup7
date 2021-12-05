import React, { Component } from 'react'
import { Text } from 'native-base'


export class LocationInfo extends Component {
	state = {
    data: [],
  };
  constructor (props) {
    super (props);
    this.state.data = props.data;
    console.log(props)
  }

	render() {
		return (
      
      
			<Text
            onPress={}
            fontSize="xs"
            _light={{
              color: "violet.500",
            }}
            _dark={{
              color: "violet.400",
            }}
            fontWeight="500"
            ml="-0.5"
            mt="-1"
          >
            {this.state.data?.name}
          </Text>
		)
	}
}

export default LocationInfo
