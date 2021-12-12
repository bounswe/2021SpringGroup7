import React, {Component,useState} from 'react';
import {Text, View, Dimensions, StyleSheet} from 'react-native';
import {AspectRatio, Image} from 'native-base';

import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json

const SLIDER_WIDTH = Dimensions.get('window').width;

function ImageCarousel(props) {
  const [index, setIndex] = useState(0)
  const [carousel, setCarousel] = useState({})

  const _renderItem=({item})=> {
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
  return (
      <Carousel
        ref={c => (setCarousel(c))}
        data={props.data}
        renderItem={_renderItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={SLIDER_WIDTH}
        layout={'default'}
        inactiveSlideScale={1}
        containerCustomStyle={{height: 80, padding: 0, margin: 0}}
        onSnapToItem={index => setIndex({index})}
      />
    );
}

export default ImageCarousel;