import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text} from 'react-native';
import {
  Button,
  FormControl,
  Spinner,
  Image,
  TextArea,
  Select,
  Input,
  Box,
} from 'native-base';
import * as ImagePicker from 'react-native-image-picker';
import TagInput from 'react-native-tags-input';
import uuid from 'react-native-uuid';

import {styles} from './CreateStory.style';
import CustomFormInput from '../../components/CustomFormInput';
import DateFormModal from '../../components/DateFormModal/DateFormModal';
import {useAuth} from '../../context/AuthContext';
import {UploadImage} from '../../configs/s3Api';
import {useMutation} from 'react-query';
import {SERVICE} from '../../services/services';
import CustomModal from '../../components/CustomModal';
import ProgressModal from '../../components/ProgressModal';
import LocationModal from '../../components/LocationModal';

const CreateStory = () => {
  let token = '';
  const {user} = useAuth();
  const guid = uuid.v4();

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [topic, setTopic] = useState('');
  const [story, setStory] = useState('');
  const [tags, setTags] = useState({
    tag: '',
    tagsArray: [],
  });
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [locationType, setLocationType] = useState('');
  const [locationName, setLocationName] = useState('');
  const [showDateModal, setShowDateModal] = useState(false);
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');

  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [file, setFile] = useState(null);

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [realLocationData, setRealLocationData] = useState({
    longitude: 0,
    latitude: 0,
  });

  const handleChangeProfileImage = async () => {
    await ImagePicker.launchImageLibrary(
      {mediaType: 'mixed', includeBase64: true},
      response => {
        setLoading(true);
        if (response.assets) {
          setFile(response.assets[0]);
          setImageUrl(response.assets[0].uri);
        } else {
          console.log('cancelled');
        }
      },
    );
    setLoading(false);
  };

  const postStory = useMutation(params => SERVICE.postStory(params, token), {
    onSuccess(response) {
      setIsButtonLoading(false);
      setModalMessage('Story is successfully created :)');
      setShowModal(true);
    },
    onError({response}) {
      console.log('resopnse hata: ', response);
      setIsButtonLoading(false);
      setModalMessage(response.data.return);
      setShowModal(true);
    },
  });

  const handleSendStory = async () => {
    setIsButtonLoading(true);
    if (file) {
      setShowProgressModal(true);
      await UploadImage(guid, file, setImageUrl, setFileUploadProgress);
    } else {
      sendRequest();
    }
  };

  const sendRequest = async () => {
    const userInfo = user?.userInfo;
    token = userInfo.token;
    const data = JSON.stringify({
      title: topic,
      text: story,
      multimedias: [`${imageUrl ? imageUrl : ''}`],
      username: userInfo.username,
      time_start: timeStart,
      time_end: timeEnd,
      location: [
        {
          location: locationName,
          latitude: realLocationData.latitude,
          longitude: realLocationData.longitude,
          type: locationType,
        },
      ],
      tags: tags.tagsArray,
    });
    try {
      await postStory.mutateAsync(data, token);
    } catch (e) {
      setIsButtonLoading(false);
      setModalMessage('Beklenmedik bir hata oluştu!');
      setShowModal(true);
    }
  };

  const closeProgressModal = () => {
    setShowProgressModal(false);
    setFileUploadProgress(0);
    sendRequest();
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <ScrollView>
      <View style={styles.pageContainer}>
        <ProgressModal
          showModal={showProgressModal}
          closeModal={closeProgressModal}
          progress={fileUploadProgress}
        />
        <CustomModal
          showModal={showModal}
          closeModal={closeModal}
          message={modalMessage}
        />
        <FormControl>
          <View style={styles.imageContainer}>
            <Button
              width={'100%'}
              mb={8}
              variant="outline"
              onPress={handleChangeProfileImage}>
              <Text style={styles.imageButtonText}>Upload File</Text>
            </Button>
            {imageUrl ? (
              <Image
                size="xl"
                alt="storyImage"
                style={styles.image}
                source={{
                  uri: `${imageUrl}`,
                }}
                fallbackSource={{
                  uri: 'https://productimages.hepsiburada.net/s/5/1500/9669876547634.jpg',
                }}
              />
            ) : (
              <Box
                width={'100%'}
                height={100}
                style={{
                  borderColor: '#0077e6',
                  borderWidth: 1,
                  borderRadius: 25,
                  justifyContent: 'center',
                }}>
                <Text style={{justifyContent: 'center', alignSelf: 'center'}}>
                  Photo
                </Text>
              </Box>
            )}
          </View>
          <CustomFormInput
            label="*Topic"
            placeholder="Enter topic"
            value={topic}
            warningMessage="Topic is not valid"
            onChange={value => setTopic(value)}
          />
          <Text style={{marginTop: 4}}>*Story</Text>

          <TextArea
            style={styles.storyArea}
            aria-label="t1"
            numberOfLines={4}
            value={story}
            onChangeText={value => setStory(value)}
            placeholder="Enter story"
            mb="5"
            borderColor="#4aa9ff"
          />
          <Text>Tags</Text>
          <TagInput
            placeholder="Tags"
            containerStyle={styles.tagContainer}
            labelStyle={{color: 'red'}}
            inputStyle={styles.tagInput}
            tagStyle={styles.tag}
            tagTextStyle={styles.tagText}
            updateState={state => setTags(state)}
            tags={tags}
          />
          <Text>*Location</Text>
          <Select
            selectedValue={locationType}
            placeholder="Choose a location type"
            borderColor="#4aa9ff"
            onValueChange={itemValue => setLocationType(itemValue)}>
            <Select.Item label="Virtual" value="Virtual" />
            <Select.Item label="Real" value="Real" />
          </Select>
          {locationType && locationType === 'Virtual' && (
            <CustomFormInput
              label="*Location Name"
              placeholder="Enter location name"
              value={locationName}
              warningMessage="Location name is not valid"
              onChange={value => setLocationName(value)}
            />
          )}
          {locationType && locationType === 'Real' && (
            <>
              <CustomFormInput
                label="*Location Name"
                placeholder="Enter location name"
                value={locationName}
                warningMessage="Location name is not valid"
                onChange={value => setLocationName(value)}
              />
              <Text>*Geolocation</Text>
              <Button
                mt={2}
                variant="outline"
                onPress={() => setShowLocationModal(true)}>
                <Text>Choose geolocation</Text>
              </Button>
            </>
          )}
          <LocationModal
            showModal={showLocationModal}
            onClose={() => setShowLocationModal(false)}
            handleSaveDate={locationData => {
              setRealLocationData(locationData);
              setShowLocationModal(false);
            }}
          />
          <Text>*Date</Text>
          <Button
            mt={2}
            variant="outline"
            onPress={() => setShowDateModal(true)}>
            <Text>Choose Date Information</Text>
          </Button>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {timeStart?.century && (
              <Input
                style={{textAlign: 'center', fontSize: 16}}
                width="45%"
                mt={2}
                isDisabled
                borderColor="#4aa9ff"
                defaultValue={`${timeStart?.century}. century `}
              />
            )}
            {timeStart?.decade && (
              <Input
                style={{textAlign: 'center', fontSize: 16}}
                width="45%"
                mt={2}
                isDisabled
                borderColor="#4aa9ff"
                defaultValue={`${timeStart?.decade}0's `}
              />
            )}
            {timeStart?.day && (
              <Input
                style={{textAlign: 'center', fontSize: 16}}
                width="45%"
                mt={2}
                isDisabled
                borderColor="#4aa9ff"
                defaultValue={`${timeStart?.day}-${timeStart?.month}-${timeStart?.year} `}
              />
            )}
            {timeStart?.month && !timeStart?.day && (
              <Input
                style={{textAlign: 'center', fontSize: 16}}
                width="45%"
                mt={2}
                isDisabled
                borderColor="#4aa9ff"
                defaultValue={`${timeStart?.month}-${timeStart?.year} `}
              />
            )}
            {timeStart?.year && !timeStart?.month && (
              <Input
                style={{textAlign: 'center', fontSize: 16}}
                width="45%"
                mt={2}
                isDisabled
                borderColor="#4aa9ff"
                defaultValue={`${timeStart?.year} `}
              />
            )}
            {timeEnd?.day && (
              <Input
                style={{textAlign: 'center', fontSize: 16}}
                width="45%"
                mt={2}
                isDisabled
                borderColor="#4aa9ff"
                defaultValue={`${timeEnd?.day}-${timeEnd?.month}-${timeEnd?.year} `}
              />
            )}
            {timeEnd?.month && !timeEnd?.day && (
              <Input
                style={{textAlign: 'center', fontSize: 16}}
                width="45%"
                mt={2}
                isDisabled
                borderColor="#4aa9ff"
                defaultValue={`${timeEnd?.month}-${timeEnd?.year} `}
              />
            )}
            {timeEnd?.year && !timeEnd?.month && (
              <Input
                style={{textAlign: 'center', fontSize: 16}}
                width="45%"
                mt={2}
                isDisabled
                borderColor="#4aa9ff"
                defaultValue={`${timeEnd?.year} `}
              />
            )}
          </Box>
          <DateFormModal
            showModal={showDateModal}
            onClose={() => setShowDateModal(false)}
            handleSaveDate={finalData => {
              setTimeStart(finalData.time_start);
              setTimeEnd(finalData.time_end);
              setShowDateModal(false);
            }}
          />
          <Button mt={4} variant="solid" onPress={handleSendStory}>
            <Text>Create Story</Text>
          </Button>
        </FormControl>
      </View>
    </ScrollView>
  );
};

export default CreateStory;
