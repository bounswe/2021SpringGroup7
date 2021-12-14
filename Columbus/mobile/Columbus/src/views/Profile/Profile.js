import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {Button} from 'native-base';

import InfoBox from './components/InfoBox';
import InfoWithIcon from './components/InfoWithIcon';
import CustomAvatar from './components/CustomAvatar';

import PageSpinner from '../../components/PageSpinner/PageSpinner';
import getInitials from '../../utils/getInitial';
import {useAuth} from '../../context/AuthContext';

import {styles} from './Profile.style';

const Profile = ({navigation, route}) => {
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (user && user?.userInfo && !userInfo) {
      const data = user?.userInfo;
      setUserInfo(data);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [user, userInfo, loading]);

  if (!userInfo && loading) {
    return <PageSpinner></PageSpinner>;
  }

  return (
    <View style={styles.pageContainer}>
      {console.log('444')}
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
          <CustomAvatar
            imageUrl={userInfo?.imageUrl}
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
            <InfoBox
              heading="Story"
              number={
                userInfo?.stories ? userInfo?.stories?.length : 0
              }></InfoBox>
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
                data={userInfo.location}></InfoWithIcon>
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
          onPress={() =>
            navigation.push('EditProfile', {
              userInfo,
            })
          }>
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
