import React from 'react';
import {View, Text} from 'react-native';
import {styles} from './InfoBox.style';

const InfoBox = props => {
  return (
    <View style={styles.InfoBoxContainer}>
      <Text style={styles.numberText}>{props.number}</Text>
      <Text style={styles.headingText}>{props.heading}</Text>
    </View>
  );
};

export default InfoBox;
