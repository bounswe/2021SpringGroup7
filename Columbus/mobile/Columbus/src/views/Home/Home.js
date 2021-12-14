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
import PageSpinner from '../../components/PageSpinner';
import PostCard from '../../components/PostCard'

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
        setPosts(response.data.return);
        console.log(response.data.return)
        setLoading(false)
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
      username: 'Kadir',
      page_number: 1,
      page_size: 5,
    });
    try {
      await fetchStories.mutateAsync(data, token);
    } catch (e) {
      console.log('e: ', e);
    }
  };

  const handleLogout = async () => {
    logout();
  };
  

  
 
  if (loading==true) {
       return <PageSpinner />;
  }

  return (
    <NativeBaseProvider>
      <ScrollView>
        <VStack flex={1} px="3" space={10} alignItems="center" mt={10}>
          {posts.map(item => {
            return (<PostCard data={item} key={item.story_id}/>);
          })}
        </VStack>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default Home;
