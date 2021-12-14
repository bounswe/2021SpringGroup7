import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Button} from 'native-base';

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

const Profile = ({navigation, route}) => {
  const {user, logout} = useAuth();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

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
    if (user) {
      userInfoRequest(user.userInfo.user_id);
      // setLoading(false);
    } else {
      setLoading(true);
    }
  }, [user]);

  const fetchUserInfo = useMutation(
    params => SERVICE.fetchUserInfo(params, user.userInfo.token),
    {
      onSuccess(response) {
        console.log('object');
        setUserInfo(response.data.response);
        setLoading(false);
      },
      onError({response}) {
        console.log('res error: ', response);
      },
    },
  );

  const userInfoRequest = async user_id => {
    try {
      await fetchUserInfo.mutateAsync(user_id);
    } catch (e) {
      console.log('e: ', e);
    }
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
        {userInfo.stories && userInfo.stories.length !== 0 ? (
          //TODO: Add story component
          <></>
        ) : (
          <Text style={{textAlign: 'center'}}>You do not share any story!</Text>
        )}
      </View>
    </View>
  );
};

export default Profile;
