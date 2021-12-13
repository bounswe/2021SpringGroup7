import React, {useState, useEffect} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Button, FormControl, Spinner, TextArea} from 'native-base';
import * as ImagePicker from 'react-native-image-picker';

import CustomFormInput from '../../../../components/CustomFormInput';
import CustomAvatar from '../../components/CustomAvatar';
import getInitials from '../../../../utils/getInitial';
import {styles} from './EditProfile.style';

const EditProfile = ({route, navigation}) => {
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const [username, setUsername] = useState(
    route.params?.userInfo?.username ? route.params.userInfo.username : '',
  );
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
    route.params?.userInfo?.location ? route.params.userInfo.location : '',
  );
  const [biography, setBiography] = useState(
    route.params?.userInfo?.biography ? route.params.userInfo.biography : '',
  );
  const [imageUrl, setImageUrl] = useState(
    route.params?.userInfo?.imageUrl ? route.params.userInfo.imageUrl : '',
  );

  useEffect(() => {
    (username === route.params.userInfo.username &&
      firstName === route.params.userInfo.first_name &&
      lastName === route.params.userInfo.last_name &&
      birthday === route.params.userInfo.birthday &&
      location === route.params.userInfo.location &&
      biography === route.params.userInfo.biography) ||
    username.length < 3 ||
    firstName.length < 3 ||
    lastName.length < 3 ||
    location.length < 3
      ? setIsDisabled(true)
      : setIsDisabled(false);
  }, [
    username,
    firstName,
    lastName,
    birthday,
    location,
    biography,
    route.params.userInfo,
  ]);

  const handleChangeUsername = value => {
    setUsername(value);
  };

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

  if (loading) {
    return <Spinner />;
  }

  return (
    <ScrollView>
      <View style={styles.pageContainer}>
        <FormControl>
          <View style={styles.formContainer}>
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
            label="Username"
            placeholder="Enter username"
            value={username}
            warningMessage="Username is not valid"
            onChange={handleChangeUsername}
          />
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
        <Button isDisabled={isDisabled}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default EditProfile;
