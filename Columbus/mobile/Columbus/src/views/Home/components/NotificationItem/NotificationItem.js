import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'native-base';
import {styles} from './NotificationItem.style';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';

const NotificationItem = props => {
  return (
    <View style={styles.notificationItemContainer}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {!props.hasIcon && (
          <Text style={styles.notificationSummaryText}>
            {props.notification.summary}
          </Text>
        )}
        {props.hasIcon && (
          <>
            <View style={{width: '70%'}}>
              <Text style={styles.notificationSummaryText}>
                {props.notification.summary}
              </Text>
            </View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <TouchableOpacity
                style={styles.approveRejectIconContainer}
                onPress={() => props.handleApproveRequest(true)}>
                <Icon name="check" size={18} />
                <Text>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.approveRejectIconContainer}
                onPress={() => props.handleApproveRequest(true)}>
                <Icon name="times" size={18} />
                <Text>Reject</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <Text style={styles.notificationDate}>
        {moment(props.notification.date).utc().format('DD/MM/YYYY hh:mm:ss')}
      </Text>
    </View>
  );
};
export default NotificationItem;
