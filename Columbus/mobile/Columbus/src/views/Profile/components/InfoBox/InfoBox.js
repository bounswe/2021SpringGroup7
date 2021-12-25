import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './InfoBox.style';

const InfoBox = props => {
  return (
    <TouchableOpacity
      style={styles.InfoBoxContainer}
      onPress={props.handleModal}>
      <Text style={styles.numberText}>{props.number}</Text>
      <Text style={styles.headingText}>{props.heading}</Text>
    </TouchableOpacity>
  );
};

export default InfoBox;
