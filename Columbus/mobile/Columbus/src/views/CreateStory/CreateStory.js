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
  const [locationType, setLocationType] = useState('');
  const [locationName, setLocationName] = useState('');
  const [showDateModal, setShowDateModal] = useState(false);
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');

  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [file, setFile] = useState(null);

  const handleChangeProfileImage = async () => {
    await ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      response => {
        setFile(response.assets[0]);
        setLoading(true);
        if (response.assets[0]) {
          setImageUrl(response.assets[0].uri);
          UploadImage(
            guid,
            response.assets[0],
            setImageUrl,
            setFileUploadProgress,
          );
        } else {
          console.log('cancelled');
        }
      },
    );
    setLoading(false);
  };

  const postStory = useMutation(params => SERVICE.postStory(params, token), {
    onSuccess(response) {
      console.log('create story response: ', response.data.return);
    },
    onError({response}) {
      console.log('res create error error: ', response);
    },
  });

  const handleSendStory = async () => {
    const userInfo = user?.userInfo;
    token = userInfo.token;
    const data = JSON.stringify({
      title: topic,
      text: story,
      multimedia:
        'https://media.istockphoto.com/photos/random-multicolored-spheres-computer-generated-abstract-form-of-large-picture-id1295274245?b=1&k=20&m=1295274245&s=170667a&w=0&h=4t-XT7aI_o42rGO207GPGAt9fayT6D-2kw9INeMYOgo=',
      username: userInfo.username,
      time_start: timeStart,
      time_end: timeEnd,
      location: {
        name: locationName,
        latitude: 0,
        longitude: 0,
        type: 'Vritual',
      },
      tags: tags.tagsArray,
    });
    try {
      await postStory.mutateAsync(data, token);
    } catch (e) {
      console.log('e: ', e);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <ScrollView>
      <View style={styles.pageContainer}>
        <FormControl>
          <View style={styles.imageContainer}>
            <Button variant="outline" onPress={handleChangeProfileImage}>
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
                  uri: 'https://www.w3schools.com/css/img_lights.jpg',
                }}
              />
            ) : (
              <Box
                style={{
                  backgroundColor: '#0077e6',
                  borderRadius: 25,
                  width: 100,
                  height: 100,
                }}>
                {file ? (
                  fileUploadProgress !== 100 ? (
                    <Spinner></Spinner>
                  ) : null
                ) : null}
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
            <Select.Item label="Virtual" value="virtual" />
            <Select.Item label="Real" value="real" />
          </Select>
          {locationType && locationType === 'virtual' && (
            <CustomFormInput
              label="*Location Name"
              placeholder="Enter location name"
              value={locationName}
              warningMessage="Location name is not valid"
              onChange={value => setLocationName(value)}
            />
          )}
          {locationType && locationType === 'real' && (
            <>
              <CustomFormInput
                label="*Location Name"
                placeholder="Enter location name"
                value={locationName}
                warningMessage="Location name is not valid"
                onChange={value => setLocationName(value)}
              />
              <Text>*Geolocation</Text>
              <Button mt={2} variant="outline">
                <Text>Choose geolocation</Text>
              </Button>
            </>
          )}
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
            {timeStart && (
              <Input
                width="45%"
                mt={2}
                isDisabled
                borderColor="#4aa9ff"
                defaultValue={timeStart}
              />
            )}
            {timeEnd && (
              <Input
                width="45%"
                mt={2}
                isDisabled
                borderColor="#4aa9ff"
                defaultValue={timeEnd}
              />
            )}
          </Box>
          <DateFormModal
            showModal={showDateModal}
            onClose={() => setShowDateModal(false)}
            handleSaveDate={(firstTime, secondTime) => {
              setTimeStart(firstTime);
              setTimeEnd(secondTime);
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
