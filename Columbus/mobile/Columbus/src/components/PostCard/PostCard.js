import React, {useState} from 'react';
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
  VStack,
  Modal,
  Button,
  TextArea,
} from 'native-base';
import Icon from 'react-native-vector-icons/Entypo';
import {TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ImageCarousel from './SubComponents/ImageCarousel';
import UserInfo from './SubComponents/UserInfo';
import LocationInfo from './SubComponents/LocationInfo';
import PostTimeInfo from './SubComponents/PostTimeInfo';
import Tags from './SubComponents/Tags';
import PostingTime from './SubComponents/PostingTime';
import LikeAndShare from './SubComponents/LikeAndShare';
import {useAuth} from './../../context/AuthContext';
import {useMutation} from 'react-query';
import {SERVICE} from '../../services/services';

const PostCard = props => {
  const {user} = useAuth();
  const {isOpen, onOpen, onClose} = useDisclose();
  const navigation = useNavigation();
  const postData = props.data;
  const [showModal, setShowModal] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [reportValue, setReportValue] = useState('');
  const [token, setToken] = useState(user?.userInfo?.token);

  const handleReportPost = async () => {
    const token = user?.userInfo?.token;
    setToken(token);
    const data = JSON.stringify({
      story_id: postData.story_id,
      username: user?.userInfo?.username,
      text: reportValue,
    });
    try {
      await reportPost.mutateAsync(data, token);
    } catch (e) {
      console.log('e: ', e);
    }
  };
  const reportPost = useMutation(
    params => SERVICE.postReportPost({params, token}),
    {
      onSuccess(response) {
        setShowModal(false);
      },
      onError({response}) {
        console.log('res error: ', response);
      },
    },
  );

  return (
    <Box
      w="100%"
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
      {postData?.multimedia?.length > 0 ? (
        <Box alignItems="center" h="150px">
          <ImageCarousel data={[postData.multimedia]} />
        </Box>
      ) : (
        <></>
      )}

      <Stack p="4" space={3}>
        <Stack space={2}>
          <HStack style={{justifyContent: 'space-between', width: '100%'}}>
            <UserInfo
              data={{
                owner_username: postData.owner_username,
                photo_url: postData.photo_url,
                user_id: postData.user_id,
              }}
            />
            <Icon
              name={'dots-three-vertical'}
              onPress={() => setShowModal(true)}
            />
          </HStack>
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content maxWidth="400px">
              <Modal.Body>
                {showReportMenu ? (
                  <>
                    <TextArea
                      variant="outline"
                      value={reportValue}
                      onChangeText={value => setReportValue(value)}
                      placeholder="Explain what is the problem with this comment"
                    />
                    <Button
                      variant="ghost"
                      colorScheme="blue"
                      onPress={() => handleReportPost()}>
                      Report
                    </Button>
                    <Button
                      variant="ghost"
                      colorScheme="red"
                      onPress={() => setShowModal(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    colorScheme="red"
                    onPress={() => setShowReportMenu(true)}>
                    Report
                  </Button>
                )}
              </Modal.Body>
            </Modal.Content>
          </Modal>

          <Heading size="md" ml="-1">
            {postData.title}
          </Heading>
          <HStack style={{justifyContent: 'space-between', width: '100%'}}>
            <LocationInfo data={postData.locations} />
            <PostTimeInfo data={postData.time_start} />
          </HStack>
        </Stack>
        <Text fontWeight="400" numberOfLines={3}>
          {postData.text}
        </Text>
        <Tags data={postData.tags} />

        <HStack style={{justifyContent: 'space-between', width: '100%'}}>
          <PostingTime data={postData.createDateTime} />
          <LikeAndShare
            data={{
              is_liked: postData.is_liked,
              story_id: postData.story_id,
              own_post: postData.owner_username == user?.userInfo?.username,
            }}
          />
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
