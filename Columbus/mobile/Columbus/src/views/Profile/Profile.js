import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
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

const Profile = ({navigation, route}) => {
  const {user, logout} = useAuth();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [storyLoading, setStoryLoading] = useState(true);
  const [userStories, setUserStories] = useState([]);
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
      userStoriesRequest(user.userInfo.username);
    }
  }, [user]);

  const fetchUserStories = useMutation(
    params => SERVICE.fetchUserPosts(params, token),
    {
      onSuccess(response) {
        setUserStories(response.data.return);
        setStoryLoading(false);
      },
      onError({response}) {
        console.log('res error res: ', response);
      },
    },
  );

  const userStoriesRequest = async username => {
    const data = JSON.stringify({
      username,
      page_number: 1,
      page_size: 10,
    });
    try {
      await fetchUserStories.mutateAsync(data);
    } catch (e) {
      console.log('e: ', e);
    }
  };

  const handleSetUserInfo = async userData => {
    await setUserInfo(userData);
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <PageSpinner></PageSpinner>;
  }

  return (
    <View style={styles.pageContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
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
            {/* <InfoBox
              heading="Story"
              number={
                userInfo?.stories ? userInfo?.stories?.length : 0
              }></InfoBox> */}
            <InfoBox
              heading="Followers"
              number={
                userInfo?.followers ? userInfo?.followers.length : 0
              }></InfoBox>
            <InfoBox
              heading="Following"
              number={
                userInfo?.followings ? userInfo?.followings.length : 0
              }></InfoBox>
          </View>
          <View style={styles.mainInfoContainer}>
            {userInfo.birthday && (
              <InfoWithIcon
                iconName="birthday-cake"
                data={userInfo.birthday}></InfoWithIcon>
            )}
            {userInfo.location && (
              <InfoWithIcon
                iconName="map-marker-alt"
                data={userInfo.location.location}></InfoWithIcon>
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
      <View style={styles.contentContainer}>
        {storyLoading && <Spinner></Spinner>}
        {!storyLoading && userStories.length !== 0 && (
          <ScrollView>
            <VStack
              flex={1}
              px="3"
              space={10}
              alignItems="center"
              pb={10}
              mt={5}>
              {userStories.map(item => {
                return <PostCard data={item} key={item.story_id} />;
              })}
            </VStack>
          </ScrollView>
        )}
        {!storyLoading && userStories.length === 0 && (
          <Text style={{textAlign: 'center'}}>You do not share any story!</Text>
        )}
      </View>
    </View>
  );
};

export default Profile;
