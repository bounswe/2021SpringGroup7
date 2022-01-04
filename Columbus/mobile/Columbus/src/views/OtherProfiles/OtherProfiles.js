import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Button, ScrollView, Spinner, VStack} from 'native-base';
import {useMutation} from 'react-query';
import Icon from 'react-native-vector-icons/FontAwesome5';

import PageSpinner from '../../components/PageSpinner/PageSpinner';
import PostCard from '../../components/PostCard';
import getInitials from '../../utils/getInitial';
import {useAuth} from '../../context/AuthContext';
import {SERVICE} from '../../services/services';

import InfoBox from '../Profile/components/InfoBox';
import InfoWithIcon from '../Profile/components/InfoWithIcon';
import CustomAvatar from '../Profile/components/CustomAvatar';
import ConnectionModal from '../Profile/components/ConnectionModal/ConnectionModal';

import {styles} from './OtherProfile.style';
import CustomModal from '../../components/CustomModal';
import SpamModal from './components/SpamModal';

const OtherProfiles = ({navigation, route}) => {
  const {user, logout} = useAuth();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [storyLoading, setStoryLoading] = useState(true);
  const [userStories, setUserStories] = useState([]);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [showSpamModal, setShowSpamModal] = useState(false);
  const [connectionModalData, setConnectionModalData] = useState(null);
  const [connectionModalHeaders, setConnectionModalHeaders] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowRequest, setIsFollowRequest] = useState(false);
  const [isPublicProfile, setIsPublicProfile] = useState(true);
  const [followButtonLoading, setFollowButtonLoading] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerBlockIconContainer}
          onPress={() => setShowSpamModal(true)}>
          <Icon name="user-alt-slash" size={24} />
        </TouchableOpacity>
      ),
      title: route.params.username,
    });
  }, [navigation, route.params.username]);

  useEffect(() => {
    setLoading(true);
    setStoryLoading(true);
    if (userInfo === null) {
      userInfoRequest(route.params.userId, route.params.token);
    }
  }, [route.params]);

  const fetchUserInformations = useMutation(
    params => SERVICE.fetchUserInfo(params),
    {
      onSuccess(response) {
        setUserInfo(response.data.response);
        setIsFollowing(response.data.response?.followers);
        if (response.data.response.public) {
          userStoriesRequest(route.params.username);
          setIsPublicProfile(true);
        } else if (
          !response.data.response.public &&
          response.data.response?.followers
        ) {
          userStoriesRequest(route.params.username);
          setIsPublicProfile(false);
        } else {
          setStoryLoading(false);
          setIsPublicProfile(false);
        }
        setLoading(false);
      },
      onError({response}) {
        console.log('res error res: ', response);
      },
    },
  );

  const userInfoRequest = async (userId, token) => {
    try {
      await fetchUserInformations.mutateAsync({params: {userId, token}});
    } catch (e) {
      console.log('e: ', e);
    }
  };

  const fetchUserStories = useMutation(
    params => SERVICE.fetchUserPosts(params, route.params.token),
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

  const followRequest = useMutation(
    params => SERVICE.postFollow(params, user.userInfo.token),
    {
      onSuccess(response) {
        if (isPublicProfile) {
          setIsFollowing(!isFollowing);
        } else {
          setIsFollowing(!isFollowing);
          setIsFollowRequest(true);
        }
        setFollowButtonLoading(false);
        setShowCustomModal(true);
        setModalMessage(response.data.return);
      },
      onError({response}) {
        setFollowButtonLoading(false);
        setShowCustomModal(true);
        setModalMessage(response.data.return);
      },
    },
  );

  const handleFollow = async () => {
    setFollowButtonLoading(true);
    const data = JSON.stringify({
      user_id: user.userInfo.user_id,
      follow: route.params.userId,
      action_follow: true,
    });
    try {
      await followRequest.mutateAsync(data);
    } catch (e) {
      setFollowButtonLoading(false);
      setShowCustomModal(true);
      setModalMessage('An unexpected error occured! Please try again later.');
    }
  };

  const handleUnFollow = async () => {
    setFollowButtonLoading(true);
    const data = JSON.stringify({
      user_id: user.userInfo.user_id,
      follow: route.params.userId,
      action_follow: false,
    });
    try {
      await followRequest.mutateAsync(data);
    } catch (e) {
      setFollowButtonLoading(false);
      setShowCustomModal(true);
      setModalMessage('An unexpected error occured! Please try again later.');
    }
  };

  if (loading) {
    return <PageSpinner></PageSpinner>;
  }

  return (
    <View style={styles.pageContainer}>
      <CustomModal
        showModal={showCustomModal}
        closeModal={() => setShowCustomModal(false)}
        message={modalMessage}
      />
      {showSpamModal && (
        <SpamModal
          showModal={showSpamModal}
          closeModal={() => setShowSpamModal(false)}
          reportedUsername={route.params.username}
          reporterUsername={user.userInfo.username}
          blocker={user.userInfo.user_id}
          blocked={route.params.userId}
          token={user.userInfo.token}
        />
      )}
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
            {!storyLoading && userStories.length !== 0 && (
              <InfoBox
                heading="Story"
                number={userStories ? userStories?.length : 0}></InfoBox>
            )}
            <InfoBox
              heading="Followers"
              number={
                userInfo?.followers
                  ? userInfo?.followers.length
                  : userInfo?.followers_count
                  ? userInfo?.followers_count
                  : 0
              }
              handleModal={
                userInfo.isPublic || userInfo?.followers
                  ? openFollowersModal
                  : () => 1
              }></InfoBox>
            <InfoBox
              heading="Following"
              number={
                userInfo?.followings
                  ? userInfo?.followings.length
                  : userInfo?.followings_count
                  ? userInfo?.followings_count
                  : 0
              }
              handleModal={
                userInfo.isPublic || userInfo?.followers
                  ? openFollowingsModal
                  : () => 1
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
        {isFollowing ? (
          isFollowRequest ? (
            <Button
              variant="outline"
              isLoading={followButtonLoading}
              onPress={handleUnFollow}>
              Revert Follow Request!
            </Button>
          ) : (
            <Button
              variant="outline"
              isLoading={followButtonLoading}
              onPress={handleUnFollow}>
              Unfollow
            </Button>
          )
        ) : (
          <Button
            variant="solid"
            isLoading={followButtonLoading}
            onPress={handleFollow}>
            Follow
          </Button>
        )}
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
      <View style={styles.contentContainer}>
        {storyLoading ? (
          <Spinner></Spinner>
        ) : isPublicProfile ? (
          userStories.length !== 0 ? (
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
          ) : (
            <Text style={{textAlign: 'center'}}>
              {`${route.params.username} does not share any story!`}
            </Text>
          )
        ) : isFollowing ? (
          userStories.length !== 0 ? (
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
          ) : (
            <Text style={{textAlign: 'center'}}>
              {`${route.params.username} does not share any story!`}
            </Text>
          )
        ) : (
          <Text style={{textAlign: 'center'}}>
            This is a private account and you have to follow to view user
            stories!
          </Text>
        )}
      </View>
    </View>
  );
};

export default OtherProfiles;
