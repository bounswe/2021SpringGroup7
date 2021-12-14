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
} from 'native-base';
import * as ImagePicker from 'react-native-image-picker';
import TagInput from 'react-native-tags-input';

import {styles} from './CreateStory.style';
import CustomFormInput from '../../components/CustomFormInput';
import DateFormModal from '../../components/DateFormModal/DateFormModal';
import {useAuth} from '../../context/AuthContext';

const CreateStory = () => {
  let token = '';
  const {user} = useAuth();

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

  const handleSendStory = async () => {
    const userInfo = JSON.parse(user?.userInfo);
    token = userInfo.token;
    const data = JSON.stringify({
      title: topic,
      text: story,
      multimedia: '',
      username: userInfo.username,
      time_start: timeStart,
      time_end: timeEnd,
      location: [string],
      tags: tags.tagsArray,
    });
    try {
      // await fetchStories.mutateAsync(data, token);
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
            {/* <Button variant="outline" onPress={handleChangeProfileImage}>
              <Text style={styles.imageButtonText}>Upload File</Text>
            </Button>
            {imageUrl && (
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
            )} */}
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
          {/* <View
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
          </View> */}
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
