import React from 'react';
import {
  Box,
  Heading,
  AspectRatio,
  Image,
  Text,
  Center,
  HStack,
  Stack,
  NativeBaseProvider,
  Avatar,
  Tag,
  useDisclose,
  VStack
} from 'native-base';
import {TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ImageCarousel from './SubComponents/ImageCarousel';
import UserInfo from './SubComponents/UserInfo';
import LocationInfo from './SubComponents/LocationInfo';
import PostTimeInfo from './SubComponents/PostTimeInfo';
import Tags from './SubComponents/Tags';
import PostingTime from './SubComponents/PostingTime';
import LikeAndShare from './SubComponents/LikeAndShare';

const PostCard = props => {
  const { isOpen, onOpen, onClose } = useDisclose()
  const navigation = useNavigation();
  const postData = {
    
      "title": "Test",
      "text": "test",
      "multimedia": "https://iheartcraftythings.com/wp-content/uploads/2021/05/How-to-draw-bird-FEAT-image.jpg",
      "user_id": 4,
      "time_start": "2021-01-10",
      "time_end": "2021-01-10",
      "createDateTime": "2021-12-12T16:33:41.496Z",
      "lastUpdate": "2021-12-12T16:33:41.497Z",
      "numberOfLikes": 0,
      "numberOfComments": 0,
      "owner_username": "Kadir",
      "is_liked": false,
      "story_id": 3,
      "locations": [
        {
          "location": "Hello",
          "latitude": 20,
          "longitude": 2,
          "type": "Virtual"
        },
        {
          "location": "Hello1",
          "latitude": 20,
          "longitude": 2,
          "type": "Virtual"
        }
      ],
      "tags": [
        "string"
      ],
      "photo_url": "https://iheartcraftythings.com/wp-content/uploads/2021/05/How-to-draw-bird-FEAT-image.jpg"
    }

  

  return (
    <Box
      maxW="80"
      rounded="lg"
      overflow="hidden"
      borderColor="coolGray.200"
      elevation={10}
      borderWidth="0"
      _dark={{
        borderColor: 'coolGray.600',
        backgroundColor: 'gray.700',
      }}
      _web={{
        shadow: 2,
        borderWidth: 0,
      }}
      _light={{
        backgroundColor: 'gray.50',
      }}>
      <Box alignItems="center" h="150px">
        <ImageCarousel data={[postData.multimedia]} />
      </Box>
      <Stack p="4" space={3}>
        <Stack space={2}>
          <UserInfo data={{'owner_username':postData.owner_username,'photo_url':postData.photo_url} }/>
          <Heading size="md" ml="-1">
            {postData.title}
          </Heading>
          <HStack space={40}>
            <LocationInfo data={postData.locations} />
          <PostTimeInfo data={postData.time} />
          </HStack>
          
        </Stack>
        <Text fontWeight="400" numberOfLines={3}>
          {postData.text}
        </Text>
        <Tags data={postData.tags} />

        <HStack >
          <PostingTime data={postData.createDateTime} />
          <LikeAndShare data={postData.comment } />

          
        </HStack>

        <Text
          onPress={() => navigation.navigate('DetailedPost', {postData})}
          fontSize="xs"
          _light={{
            color: 'blue.500',
          }}
          _dark={{
            color: 'blue.400',
          }}
          fontWeight="500"
          ml="-0.5"
          mt="-1">
          See More
        </Text>
        
      </Stack>
    </Box>
  );
};

export default PostCard;
