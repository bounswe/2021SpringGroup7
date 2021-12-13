import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {
  Button,
  Spinner,
  NativeBaseProvider,
  ScrollView,
  VStack,
} from 'native-base';

import {useAuth} from '../../context/AuthContext';
import {SERVICE} from '../../services/services';
import {useMutation} from 'react-query';

const Home = () => {
  const {logout, user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  let token = '';

  useEffect(() => {
    if (user) {
      storiesRequest();
    } else {
      setLoading(true);
    }
  }, [user]);

  const fetchStories = useMutation(
    params => SERVICE.fetchPost({params, token}),
    {
      onSuccess(response) {
        console.log('response: ', response.data.return);
        res=JSON.parse(response.data.return)
        setPosts(response.data.return);
      },
      onError({response}) {
        console.log('res error: ', response);
      },
    },
  );

  const storiesRequest = async () => {
    const userInfo = JSON.parse(user?.userInfo);
    token = userInfo.token;

    const data = JSON.stringify({
      username: 'mervebrn',
      page_number: 1,
      page_size: 5,
    });
    try {
      await fetchStories.mutateAsync(data, 'TOKEN 90bff3a5f1a6a9f9ab2d961186674e1f10d2fb84');
    } catch (e) {
      console.log('e: ', e);
    }
  };

  const handleLogout = async () => {
    logout();
  };
  

  
  

  if (loading==true) {
    return <View
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Spinner />
      </View>
  }

  return (
    <NativeBaseProvider>
      <ScrollView>
        <VStack flex={1} px="3" space={10} alignItems="center" mt={10}>
          {posts.map(item => {
            return (<PostCard />);
          })}
        </VStack>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default Home;
