import React, {useState} from 'react';
import {
  View,
  Text,
  Container,
  Heading,
  Box,
  HStack,
  VStack,
  Stack,
  ScrollView,
} from 'native-base';
import ImageCarousel from '../../components/PostCard/SubComponents/ImageCarousel';
import UserInfo from '../../components/PostCard/SubComponents/UserInfo';
import LocationInfo from '../../components/PostCard/SubComponents/LocationInfo';
import PostTimeInfo from '../../components/PostCard/SubComponents/PostTimeInfo';
import Tags from '../../components/PostCard/SubComponents/Tags';
import PostingTime from '../../components/PostCard/SubComponents/PostingTime';
import LikeAndShare from '../../components/PostCard/SubComponents/LikeAndShare';
import MapView, {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';

const DetailedPost = props => {
  const post = props.route?.params?.postData;
  const [index, setIndex] = useState(0);

  return (
    <ScrollView w="100%">
      <Box
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        elevation={10}
        borderWidth="0"
        w='100%'
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
        <Stack p="4" space={3}>
          <Stack space={2}>
            <UserInfo
              data={{
                owner_username: post.owner_username,
                photo_url: post.photo_url,
              }}
            />
            <Heading size="md" ml="-1">
              {post.title}
            </Heading>
            <HStack style={{justifyContent: 'space-between', width: '100%'}}>
              <LocationInfo data={post.locations} />
              <PostTimeInfo data={post.time_start} />
            </HStack>
          </Stack>
          <Text fontWeight="400">{post.text}</Text>
          <Tags data={post.tags} />
          {post?.multimedia?.length > 0 ? (
            <Box alignItems="center" h="150px">
              <ImageCarousel data={[postData.multimedia]} />
            </Box>
          ) : (
            <></>
          )}
          {post.locations[0].type != 'Virtual' ? (
            <Box
              style={{
                width: '100%',
                padding: 20,
                backgroundColor: '#ffffff',
                elevation: 10,
              }}>
              
                <HStack
                  style={{justifyContent: 'space-between', width: '100%'}}>
                  <Icon
                    name={'angle-left'}
                    size={30}
                    onPress={() =>
                      setIndex(index - 1 < 0 ? post.locations.length - 1 : 0)
                    }
                  />
                  <Heading textAlign="center" m={2} >
                  <Text>{post.locations[index].location}</Text>
                   </Heading>
                  <Icon
                    name={'angle-right'}
                    size={30}
                    onPress={() =>
                      setIndex((index + 1) % post.locations.length)
                    }
                  />
                </HStack>
             

              <MapView
                style={{width: '100%', height: 200}}
                region={{
                  latitude: post.locations[index].latitude,
                  longitude: post.locations[index].longitude,
                  latitudeDelta: 0.3,
                  longitudeDelta: 0.3,
                }}>
                {post.locations.map(loc => {
                  return (
                    <Marker
                      coordinate={{
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                      }}
                      title={loc.location}
                    />
                  );
                })}
              </MapView>
            </Box>
          ) : (
            <></>
          )}

          <HStack style={{justifyContent: 'space-between', width: '100%'}}>
            <PostingTime data={post.createDateTime} />
            <LikeAndShare data={post.comment} />
          </HStack>
        </Stack>
      </Box>
    </ScrollView>
  );
};

export default DetailedPost;
