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
  useDisclose
} from 'native-base';
import {TouchableOpacity, View} from 'react-native';
import ImageCarousel from './SubComponents/ImageCarousel';
import UserInfo from './SubComponents/UserInfo';
import LocationInfo from './SubComponents/LocationInfo';
import PostTimeInfo from './SubComponents/PostTimeInfo';
import Tags from './SubComponents/Tags';
import PostingTime from './SubComponents/PostingTime';
import LikeAndShare from './SubComponents/LikeAndShare';

const PostCard = props => {
  const { isOpen, onOpen, onClose } = useDisclose()
  const postData = {
    imgData: [
      'https://cdn.techinasia.com/wp-content/uploads/2013/09/silicon-valley-asia.jpg',
      'https://lampalampa.net/wp-content/uploads/2018/03/WHY-THE-APPEARANCE-OF-EUROPEAN-SILICON-VALLEY-IS-IMPOSSIBLE.jpg',
    ],
    title: 'The Garden City',
    location: {
      name: 'The Silicon Valley',
      longitude: 1234,
      latitude: 1234,
    },
    time: "80's",
    content:
      "Silicon Valley is a region in Northern California that serves as a global center for high technology and innovation. Located in the southern part of the San Francisco Bay Area, it corresponds roughly to the geographical Santa Clara Valley.[1][2][3] San Jose is Silicon Valley's largest city, the third-largest in California, and the tenth-largest in the United States; other major Silicon Valley cities include Sunnyvale, Santa Clara, Redwood City, Mountain View, Palo Alto, Menlo Park, and Cupertino. The San Jose Metropolitan Area has the third-highest GDP per capita in the world (after Zurich, Switzerland and Oslo, Norway), according to the Brookings Institution,[4] and, as of June 2021, has the highest percentage in the country of homes valued at $1 million or more.[5]",
    tags: ['Sen de yargilacaksin', 'Bill Gates', 'Apple', 'Microsoft'],
    owner: {
      username: 'Homebird63',
      img: 'https://pbs.twimg.com/profile_images/1313221527580676097/LV9VsA2p_400x400.jpg',
    },
    postingTime: '6 min ago',
    comment: {nofComments: 10},

  };

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
        <ImageCarousel data={postData.imgData} />
      </Box>
      <Stack p="4" space={3}>
        <Stack space={2}>
          <UserInfo data={postData.owner} />
          <Heading size="md" ml="-1">
            {postData.title}
          </Heading>
          <HStack space={40}>
            <LocationInfo data={postData.location} />
          <PostTimeInfo data={postData.time} />
          </HStack>
          
        </Stack>
        <Text fontWeight="400" numberOfLines={3}>
          {postData.content}
        </Text>
        <Tags data={postData.tags} />

        <HStack space={35}>
          <PostingTime data={postData.postingTime} />
          <LikeAndShare data={postData.comment} />
        </HStack>

        <Text
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
