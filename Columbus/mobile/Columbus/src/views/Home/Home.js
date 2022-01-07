import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Button, Spinner, NativeBaseProvider, VStack} from 'native-base';
import Icon from 'react-native-vector-icons';
import {useAuth} from '../../context/AuthContext';
import {SERVICE} from '../../services/services';
import {useMutation} from 'react-query';
import PageSpinner from '../../components/PageSpinner';
import PostCard from '../../components/PostCard';
import {styles} from './Home.style';

const Home = ({navigation}) => {
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [token, setToken] = useState(user.userInfo.token);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerNotificationIconContainer}
          onPress={() =>
            navigation.push('Notification', {username: user.userInfo.username})
          }>
          <Icon name="notifications" size={18} />
          <Text>Notifications</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (user) {
      setToken(user.userInfo.token);
      storiesRequest(user.userInfo.username);
    } else {
      setLoading(true);
    }
  }, [user, isRefreshing]);

  const fetchStories = useMutation(params => SERVICE.fetchPost(params, token), {
    onSuccess(response) {
      setPosts(response.data.return);
      setIsRefreshing(false);
      setLoading(false);
    },
    onError({response}) {
      setIsRefreshing(false);
      console.log('res error: ', response);
    },
  });

  const storiesRequest = async username => {
    const data = JSON.stringify({
      username,
      page_number: 1,
      page_size: 10,
    });
    try {
      await fetchStories.mutateAsync(data);
    } catch (e) {
      setIsRefreshing(false);
      console.log('e: ', e);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 550);
  };

  if (loading == true) {
    return <PageSpinner />;
  }

  return (
    <NativeBaseProvider>
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={handleRefresh} refreshing={isRefreshing} />
        }>
        <VStack flex={1} px="3" space={10} alignItems="center" pb={10} mt={5}>
          {posts.map(item => {
            return <PostCard data={item} key={item.story_id} />;
          })}
        </VStack>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default Home;
