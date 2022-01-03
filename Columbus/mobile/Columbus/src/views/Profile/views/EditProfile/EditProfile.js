import React, {useState, useEffect} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {
  Button,
  FormControl,
  Input,
  Spinner,
  Switch,
  TextArea,
} from 'native-base';
import * as ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import CustomFormInput from '../../../../components/CustomFormInput';
import CustomAvatar from '../../components/CustomAvatar';
import getInitials from '../../../../utils/getInitial';
import {styles} from './EditProfile.style';
import {SERVICE} from '../../../../services/services';
import {useMutation} from 'react-query';
import {useAuth} from '../../../../context/AuthContext';
import {UploadProfileImage} from '../../../../configs/s3Api';
import ProgressModal from '../../../../components/ProgressModal';
import CustomModal from '../../../../components/CustomModal';
import moment from 'moment';

const EditProfile = ({route, navigation}) => {
  const [loading, setLoading] = useState(false);
  const [isSaveButtonLoading, setIsSaveButtonLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [fileUploadProgress, setFileUploadProgress] = React.useState(0);
  const [imageFile, setImageFile] = React.useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [openDateModal, setOpenDateModal] = useState(false);

  const {updateUserInfo} = useAuth();

  const [firstName, setFirstName] = useState(
    route.params?.userInfo?.first_name ? route.params.userInfo.first_name : '',
  );
  const [isPublic, setIsPublic] = useState(
    route.params?.userInfo?.public ? route.params.userInfo.public : true,
  );
  const [lastName, setLastName] = useState(
    route.params?.userInfo?.last_name ? route.params.userInfo.last_name : '',
  );
  const [birthday, setBirthday] = useState(
    route.params?.userInfo?.birthday
      ? new Date(route.params.userInfo.birthday)
      : new Date(1598051730010),
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
      biography === route.params.userInfo.biography) ||
    firstName.length < 3 ||
    lastName.length < 3
      ? setIsDisabled(true)
      : setIsDisabled(false);
  }, [firstName, lastName, birthday, biography, route.params.userInfo]);

  const handleChangeProfileImage = async () => {
    await ImagePicker.launchImageLibrary(
      {mediaType: 'mixed', includeBase64: true},
      response => {
        setLoading(true);
        if (response.assets) {
          setImageUrl(response.assets[0].uri);
          setImageFile(response.assets[0]);
        } else {
          console.log('cancelled');
        }
      },
    );
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    setIsSaveButtonLoading(true);
    if (imageFile) {
      setShowProgressModal(true);
      await UploadProfileImage(
        route.params.userInfo.user_id,
        imageFile,
        setImageUrl,
        setFileUploadProgress,
      );
    } else {
      sendRequest();
    }
  };

  const sendRequest = async () => {
    var d = new Date(birthday),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    const sendBirthDay = [year, month, day].join('-');
    const data = JSON.stringify({
      user_id: route.params.userInfo.user_id,
      first_name: firstName,
      last_name: lastName,
      photo_url: imageUrl
        ? imageUrl
        : route.params.userInfo.photo_url
        ? route.params.userInfo.photo_url
        : '',
      birthday: sendBirthDay,
      biography: biography,
      public: isPublic,
    });
    try {
      await postUserInfo.mutateAsync(data);
    } catch (e) {
      console.log('e edit: ', e);
    } finally {
      setIsSaveButtonLoading(false);
    }
  };

  const postUserInfo = useMutation(
    params => SERVICE.postUserInfo(params, route.params.token),
    {
      onSuccess(response) {
        if (response.data.response) {
          // Add a modal to show correctly saved
          updateUserInformations(response.data.response);
          navigation.goBack();
        }
      },
      onError({response}) {
        console.log('res edit error: ', response);
        setShowCustomModal(true);
      },
    },
  );

  const updateUserInformations = async data => {
    await updateUserInfo(data);
  };

  const closeModal = () => {
    setShowProgressModal(false);
    setFileUploadProgress(0);
    sendRequest();
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <ScrollView>
      <View style={styles.pageContainer}>
        <ProgressModal
          showModal={showProgressModal}
          closeModal={closeModal}
          progress={fileUploadProgress}
        />
        <CustomModal
          showModal={showCustomModal}
          closeModal={() => setShowCustomModal(false)}
          message={'An unexpected error occurred! Please, try again later.'}
        />
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
          <View style={styles.inputRowContainer}>
            <CustomFormInput
              label="First Name"
              placeholder="Enter first name"
              value={firstName}
              warningMessage="First name is not valid"
              onChange={value => setFirstName(value)}
              width="70%"
            />
            <View style={styles.switchContainer}>
              <FormControl.Label>To Private</FormControl.Label>
              <Switch
                size="sm"
                isChecked={!isPublic}
                onToggle={value => setIsPublic(!value)}
              />
            </View>
          </View>
          <View style={styles.inputRowContainer}>
            <CustomFormInput
              label="Last Name"
              placeholder="Enter last name"
              value={lastName}
              warningMessage="Last name is not valid"
              onChange={value => setLastName(value)}
              width="70%"
            />
            <View style={styles.dateContainer}>
              <FormControl.Label
                style={{display: 'flex', justifyContent: 'flex-end'}}>
                Birthday
              </FormControl.Label>
              <Button
                width={'95%'}
                ml={2}
                variant="outline"
                onPress={() => setOpenDateModal(true)}>
                <Text>{`${moment(birthday).utc().format('DD/MM/YYYY')}`}</Text>
              </Button>
              {openDateModal && (
                <DateTimePicker
                  textColor="white"
                  display="spinner"
                  value={birthday}
                  onChange={(event, value) => {
                    if (value !== undefined) {
                      setBirthday(value);
                    }
                    setOpenDateModal(false);
                  }}
                />
              )}
            </View>
          </View>

          <Text>Biography</Text>
          <TextArea
            style={styles.biographyArea}
            aria-label="t1"
            numberOfLines={4}
            value={biography}
            onChangeText={value => setBiography(value)}
            placeholder="Enter biography"
            borderColor="#4aa9ff"
            mb="5"
          />
        </FormControl>
        <Button
          isLoading={isSaveButtonLoading}
          isDisabled={isDisabled}
          onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default EditProfile;
