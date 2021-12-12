import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {styles} from './InfoWithIcon.style';

const InfoWithIcon = props => {
  return (
    <View style={styles.InfoWithIconContainer}>
      <Icon name={props.iconName} size={16} color="black" />
      <Text style={styles.dataText}>{props.data}</Text>
    </View>
  );
};

export default InfoWithIcon;
