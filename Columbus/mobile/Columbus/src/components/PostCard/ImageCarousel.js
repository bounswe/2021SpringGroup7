import React, {Component} from 'react';
import {Text, View, Dimensions, StyleSheet} from 'react-native';
import {AspectRatio, Image} from 'native-base';

import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);

export default class ImageCarousel extends Component {
  state = {
    index: 0,
    data: [],
  };

  constructor(props) {
    super(props);
    this._renderItem = this._renderItem.bind(this);
    this.state.data = props.data;
  }

  _renderItem({item}) {
    console.log('item', item);
    return (
      <AspectRatio w={SLIDER_WIDTH} ratio={4 / 3}>
        <Image
          source={{
            uri: item,
          }}
          alt="image"
          style={{padding: 0, marginTop: 150}}
        />
      </AspectRatio>
    );
  }

  render() {
    return (
      <Carousel
        ref={c => (this.carousel = c)}
        data={this.state.data}
        renderItem={this._renderItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={SLIDER_WIDTH}
        layout={'default'}
        inactiveSlideScale={1}
        containerCustomStyle={{height: 80, padding: 0, margin: 0}}
        onSnapToItem={index => this.setState({index})}
      />
    );
  }
}
