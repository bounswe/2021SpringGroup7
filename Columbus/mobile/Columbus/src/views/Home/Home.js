import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {Button, Spinner} from 'native-base';

import {useAuth} from '../../context/AuthContext';
import {SERVICE} from '../../services/services';
import {useMutation} from 'react-query';

const Home = () => {
  const {logout, user} = useAuth();
  const [loading, setLoading] = useState(true);

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
        console.log('rwesponse: ', response.data.return);
        // navigation.navigate('HomePage');
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
      await fetchStories.mutateAsync(data, token);
    } catch (e) {
      console.log('e: ', e);
    }
  };

  const handleLogout = async () => {
    logout();
  };

  if (loading) {
    <View
      style={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Spinner />;
    </View>;
  }

  return (
    <View style={{display: 'flex', justifyContent: 'center', marginTop: 50}}>
      <Text style={{textAlign: 'center'}}>Welcome to Home Page</Text>
      <Button mt="2" onPress={handleLogout}>
        Logout
      </Button>
    </View>
  );
};

export default Home;
