import React from 'react';
import {View} from 'react-native';
import {Text} from 'native-base';
import {styles} from './NotificationItem.style';
import moment from 'moment';

const NotificationItem = props => {
  return (
    <View style={styles.notificationItemContainer}>
      <Text style={styles.notificationSummaryText}>
        {props.notification.summary}
      </Text>
      <Text style={styles.notificationDate}>
        {moment(props.notification.date).utc().format('DD/MM/YYYY hh:mm:ss')}
      </Text>
    </View>
  );
};
export default NotificationItem;
