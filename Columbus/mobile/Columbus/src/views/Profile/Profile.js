import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  RefreshControl,
} from 'react-native';
import {Button, ScrollView, Spinner, VStack} from 'native-base';

import InfoBox from './components/InfoBox';
import InfoWithIcon from './components/InfoWithIcon';
import CustomAvatar from './components/CustomAvatar';

import PageSpinner from '../../components/PageSpinner/PageSpinner';
import getInitials from '../../utils/getInitial';
import {useAuth} from '../../context/AuthContext';

import {styles} from './Profile.style';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {useMutation} from 'react-query';
import {SERVICE} from '../../services/services';
import PostCard from '../../components/PostCard';
import ConnectionModal from './components/ConnectionModal/ConnectionModal';
import {SceneMap, TabView} from 'react-native-tab-view';
import {convertBirthday} from '../../utils/readableDate';

const Profile = ({navigation, route}) => {
  const layout = useWindowDimensions();
  const {user, logout} = useAuth();
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [storyLoading, setStoryLoading] = useState(true);
  const [userStories, setUserStories] = useState([]);
  const [userLikedStoryLoading, setUserLikedStoryLoading] = useState(true);
  const [userLikedStories, setUserLikedStories] = useState([]);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [connectionModalData, setConnectionModalData] = useState(null);
  const [connectionModalHeaders, setConnectionModalHeaders] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [routes] = useState([
    {key: 'first', title: 'Shared'},
    {key: 'second', title: 'Liked'},
  ]);

  let token = '';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerExitIconContainer}
          onPress={handleLogout}>
          <Icon name="reply" size={18} />
          <Text>Exit</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    setLoading(true);
    if (user) {
      handleSetUserInfo(user.userInfo);
      token = user.userInfo.token;
      userStoriesRequest();
    }
  }, [user, navigation]);

  const fetchUserStories = useMutation(
    params => SERVICE.fetchUserPosts(params, user.userInfo.token),
    {
      onSuccess(response) {
        setUserStories(response.data.return);
        setStoryLoading(false);
        setIsRefreshing(false);
      },
      onError({response}) {
        setStoryLoading(false);
        setIsRefreshing(false);
        console.log('fetch story error: ', response);
      },
    },
  );

  const fetchUserLikedStories = useMutation(
    params => SERVICE.fetchUserLikedPosts(params, user.userInfo.token),
    {
      onSuccess(response) {
        console.log('res liked: ', response);
        setUserLikedStories(response.data.return);
        setUserLikedStoryLoading(false);
        setIsRefreshing(false);
      },
      onError({response}) {
        setUserLikedStoryLoading(false);
        setIsRefreshing(false);
        console.log('res liked error:  ', response);
      },
    },
  );

  const userStoriesRequest = async () => {
    setStoryLoading(true);
    setUserLikedStoryLoading(true);
    const data = JSON.stringify({
      username: user.userInfo.username,
      page_number: 1,
      page_size: 10,
    });
    try {
      await fetchUserStories.mutateAsync(data);
      await fetchUserLikedStories.mutateAsync(data);
    } catch (e) {
      setStoryLoading(false);
      setUserLikedStoryLoading(false);
      console.log('err: ', e);
    }
  };

  const handleSetUserInfo = async userData => {
    await setUserInfo(userData);
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
  };

  const openFollowersModal = () => {
    setConnectionModalData(userInfo.followers);
    setConnectionModalHeaders('Followers');
    setShowConnectionsModal(true);
  };

  const openFollowingsModal = () => {
    setConnectionModalData(userInfo.followings);
    setConnectionModalHeaders('Followings');
    setShowConnectionsModal(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await userStoriesRequest();
    } catch (e) {
      setIsRefreshing(false);
      setStoryLoading(false);
      setUserLikedStoryLoading(false);
      console.log('err: ', e);
    }
  };

  const FirstRoute = () => (
    <View style={styles.contentContainer}>
      {storyLoading && <Spinner></Spinner>}
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={handleRefresh} refreshing={isRefreshing} />
        }>
        {!storyLoading && userStories.length !== 0 && (
          <VStack flex={1} px="3" space={10} alignItems="center" pb={10} mt={5}>
            {userStories.map(item => {
              return <PostCard data={item} key={item.story_id} />;
            })}
          </VStack>
        )}
        {!storyLoading && userStories.length === 0 && (
          <Text style={{textAlign: 'center'}}>You do not share any story!</Text>
        )}
      </ScrollView>
    </View>
  );

  const SecondRoute = () => (
    <View style={styles.contentContainer}>
      {userLikedStoryLoading && <Spinner></Spinner>}
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={handleRefresh} refreshing={isRefreshing} />
        }>
        {!userLikedStoryLoading && userLikedStories.length !== 0 && (
          <VStack flex={1} px="3" space={10} alignItems="center" pb={10} mt={5}>
            {userLikedStories.map(item => {
              return <PostCard data={item} key={item.story_id} />;
            })}
          </VStack>
        )}
        {!userLikedStoryLoading && userLikedStories.length === 0 && (
          <Text style={{textAlign: 'center'}}>You do not liked any story!</Text>
        )}
      </ScrollView>
    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  if (loading) {
    return <PageSpinner></PageSpinner>;
  }

  return (
    <View style={styles.pageContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
          {console.log('1234qwer: ', userInfo?.photo_url)}
          <CustomAvatar
            imageUrl={userInfo?.photo_url}
            initials={`${getInitials(userInfo.username)}`}
          />

          {userInfo.first_name && userInfo.last_name ? (
            <Text
              style={
                styles.avatarName
              }>{`${userInfo.first_name} ${userInfo.last_name}`}</Text>
          ) : (
            <Text style={styles.avatarName}>{`${userInfo.username}`}</Text>
          )}
        </View>
        <View style={styles.headerRightSideContainer}>
          <View style={styles.infoBoxContainer}>
            {!storyLoading && userStories.length !== 0 && (
              <InfoBox
                heading="Story"
                number={userStories ? userStories?.length : 0}></InfoBox>
            )}
            <InfoBox
              heading="Followers"
              number={userInfo?.followers ? userInfo?.followers.length : 0}
              handleModal={openFollowersModal}></InfoBox>
            <InfoBox
              heading="Following"
              number={userInfo?.followings ? userInfo?.followings.length : 0}
              handleModal={openFollowingsModal}></InfoBox>
          </View>
          <View style={styles.mainInfoContainer}>
            {userInfo.birthday && (
              <InfoWithIcon
                iconName="birthday-cake"
                data={convertBirthday(userInfo.birthday)}></InfoWithIcon>
            )}
          </View>
        </View>
      </View>
      <View style={styles.biographyContainer}>
        <Text>{userInfo.biography}</Text>
      </View>
      <View style={styles.editContainer}>
        <Button
          variant="outline"
          onPress={() => {
            navigation.push('EditProfile', {
              userInfo,
              token: user.userInfo.token,
            });
          }}>
          Edit Profile
        </Button>
      </View>
      {showConnectionsModal && (
        <ConnectionModal
          showModal={showConnectionsModal}
          closeModal={() => setShowConnectionsModal(false)}
          data={connectionModalData}
          header={connectionModalHeaders}
          navigation={navigation}
        />
      )}
      <View style={{flex: 7, padding: 8}}>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        />
      </View>
    </View>
  );
};

export default Profile;
