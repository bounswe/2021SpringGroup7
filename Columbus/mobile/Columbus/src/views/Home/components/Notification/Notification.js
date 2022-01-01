import {ScrollView, Text} from 'native-base';
import React, {useEffect, useState} from 'react';
import {View, useWindowDimensions} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import {useMutation} from 'react-query';
import PageSpinner from '../../../../components/PageSpinner/PageSpinner';
import {useAuth} from '../../../../context/AuthContext';
import {SERVICE} from '../../../../services/services';
import NotificationItem from '../NotificationItem';
import {styles} from './Notification.style';

const Notification = ({navigation, route}) => {
  const layout = useWindowDimensions();
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [followRequest, setFollowRequest] = useState([]);
  const [otherNotifications, setOtherNotifications] = useState([]);
  const [routes] = useState([
    {key: 'first', title: 'Follow Request'},
    {key: 'second', title: 'Other Notifications'},
  ]);

  useEffect(() => {
    if (route.params.username) {
      setLoading(true);
      notificationsRequest(route.params.username);
    }
  }, [route.params.username]);

  const fetchNotifications = useMutation(
    params => SERVICE.fetchNotifications(params, user.userInfo.token),
    {
      onSuccess(response) {
        console.log(
          'response data: ',
          response.data.other_notifications.orderedItems,
        );
        setFollowRequest(response.data.follow_requests);
        setOtherNotifications(response.data.other_notifications);
        setLoading(false);
      },
      onError({response}) {
        setLoading(false);
        console.log('reso:  ', response);
      },
    },
  );

  const notificationsRequest = async username => {
    const data = JSON.stringify({
      user_name: username,
      limit: 20,
    });
    try {
      await fetchNotifications.mutateAsync(data);
    } catch (e) {
      console.log('e: ', e);
    }
  };

  const FirstRoute = () => (
    <ScrollView style={{flex: 1}}>
      <View>
        {followRequest?.orderedItems.length !== 0 ? (
          followRequest.orderedItems.map(notification => (
            <NotificationItem notification={notification} />
          ))
        ) : (
          <Text style={styles.nullNotificationText}>
            You don't have any follow request!
          </Text>
        )}
      </View>
    </ScrollView>
  );

  const SecondRoute = () => (
    <ScrollView style={{flex: 1}}>
      <View>
        {otherNotifications?.orderedItems.length !== 0 ? (
          otherNotifications.orderedItems.map(notification => (
            <NotificationItem notification={notification} />
          ))
        ) : (
          <Text style={styles.nullNotificationText}>
            You don't have any follow request!
          </Text>
        )}
      </View>
    </ScrollView>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  if (loading) {
    return <PageSpinner></PageSpinner>;
  }

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
    />
  );
};
export default Notification;
