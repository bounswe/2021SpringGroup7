import React, {useState, useEffect} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Button, FormControl, Spinner, TextArea} from 'native-base';
import * as ImagePicker from 'react-native-image-picker';

import CustomFormInput from '../../../../components/CustomFormInput';
import CustomAvatar from '../../components/CustomAvatar';
import getInitials from '../../../../utils/getInitial';
import {styles} from './EditProfile.style';
import {SERVICE} from '../../../../services/services';
import {useMutation} from 'react-query';
import {useAuth} from '../../../../context/AuthContext';

const EditProfile = ({route, navigation}) => {
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const {updateUserInfo} = useAuth();

  const [firstName, setFirstName] = useState(
    route.params?.userInfo?.first_name ? route.params.userInfo.first_name : '',
  );
  const [lastName, setLastName] = useState(
    route.params?.userInfo?.last_name ? route.params.userInfo.last_name : '',
  );
  const [birthday, setBirthday] = useState(
    route.params?.userInfo?.birthday ? route.params.userInfo.birthday : '',
  );
  const [location, setLocation] = useState(
    route.params?.userInfo?.location
      ? route.params.userInfo.location.location
      : '',
  );
  const [biography, setBiography] = useState(
    route.params?.userInfo?.biography ? route.params.userInfo.biography : '',
  );
  const [imageUrl, setImageUrl] = useState(
    route.params?.userInfo?.photo_url ? route.params.userInfo.photo_url : '',
  );

  useEffect(() => {
    (firstName === route.params.userInfo.first_name &&
      lastName === route.params.userInfo.last_name &&
      birthday === route.params.userInfo.birthday &&
      location === route.params.userInfo.location.location &&
      biography === route.params.userInfo.biography) ||
    firstName.length < 3 ||
    lastName.length < 3 ||
    location.length < 3
      ? setIsDisabled(true)
      : setIsDisabled(false);
  }, [
    firstName,
    lastName,
    birthday,
    location,
    biography,
    route.params.userInfo,
  ]);

  const handleChangeFirstName = value => {
    setFirstName(value);
  };

  const handleChangeLastName = value => {
    setLastName(value);
  };

  const handleChangeBirthday = value => {
    setBirthday(value);
  };

  const handleChangeLocation = value => {
    setLocation(value);
  };

  const handleChangeBiography = value => {
    setBiography(value);
  };

  const handleChangeProfileImage = async () => {
    await ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      response => {
        setLoading(true);
        if (response.assets) {
          setImageUrl(response.assets[0].uri);
        } else {
          console.log('cancelled');
        }
      },
    );
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    const data = JSON.stringify({
      id: route.params.userInfo.user_id,
      first_name: firstName,
      last_name: lastName,
      photo_url: route.params.userInfo.photo_url,
      birthday: birthday,
      location: route.params.userInfo.location,
      biography: biography,
    });

    try {
      await postUserInfo.mutateAsync(data);
    } catch (e) {
      console.log('e edit: ', e);
    }
  };

  const postUserInfo = useMutation(
    params => SERVICE.postUserInfo(params, route.params.token),
    {
      onSuccess(response) {
        console.log('cevap: ', response);
        if (response.data.response) {
          // Add a modal to show correctly saved
          updateUserInfo(response.data.response);
          navigation.goBack();
        }
      },
      onError({response}) {
        console.log('res edit error: ', response);
      },
    },
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <ScrollView>
      <View style={styles.pageContainer}>
        <FormControl>
          <View style={styles.imageContainer}>
            <Button variant="outline" onPress={handleChangeProfileImage}>
              <Text style={styles.imageButtonText}>Change Profile Picture</Text>
            </Button>
            <CustomAvatar
              size="xl"
              imageUrl={imageUrl}
              initials={`${getInitials(firstName)}${getInitials(lastName)}`}
            />
          </View>
          <CustomFormInput
            label="First Name"
            placeholder="Enter first name"
            value={firstName}
            warningMessage="First name is not valid"
            onChange={handleChangeFirstName}
          />
          <CustomFormInput
            label="Last Name"
            placeholder="Enter last name"
            value={lastName}
            warningMessage="Last name is not valid"
            onChange={handleChangeLastName}
          />
          {/* TODO: Convert to date picker */}
          <CustomFormInput
            label="Birthday"
            placeholder="Enter birthday"
            value={birthday}
            warningMessage="Birthday is not valid"
            onChange={handleChangeBirthday}
          />
          <CustomFormInput
            label="Location"
            placeholder="Enter location"
            value={location}
            warningMessage="Location is not valid"
            onChange={handleChangeLocation}
          />
          <Text>Biography</Text>
          <TextArea
            style={styles.biographyArea}
            aria-label="t1"
            numberOfLines={4}
            value={biography}
            onChangeText={handleChangeBiography}
            placeholder="Enter biography"
            borderColor="#4aa9ff"
            mb="5"
          />
        </FormControl>
        <Button isDisabled={isDisabled} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default EditProfile;
