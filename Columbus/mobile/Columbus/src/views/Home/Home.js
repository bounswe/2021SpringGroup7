import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {Button} from 'native-base';
import PostCard from '../../components/PostCard';
import {useAuth} from '../../context/AuthContext';
import {Center, NativeBaseProvider, ScrollView, VStack} from 'native-base';
import {SERVICE} from '../../services/services';
import {useMutation} from 'react-query';

const Home = () => {
  const {logout} = useAuth();
  const [posts, setPosts] = useState([]);
  const [fetched, setFetched] = useState(false);

  const handleLogout = async () => {
    logout();
  };
  const handleClick = async () => {
    console.log('click')
    try {
      await fetchHome.mutateAsync({
      
        username: 'mervebrn',
        page_number: 1,
        page_size: 5,
      
    })
  
    } catch (error) {
      console.log(error)
    }
}
    

  const fetchHome = useMutation(data => SERVICE.home({data}), {
    onSuccess(response) {
      console.log(response);
      setPosts(response)
      // navigation.navigate('HomePage');
    },
    onError({response}) {
      console.log('res: ', response);
    },
  });

  // if (!fetched) {
  //   data = JSON.stringify({
  //     username: 'mervebrn',
  //     page_number: 1,
  //     page_size: 5,
  //   });
  //   try {
  //     async () => {
  //       await fetchHome.mutateAsync(data);

  //     };
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  return (
    <NativeBaseProvider>
      <ScrollView>
        <VStack flex={1} px="3" space={10} alignItems="center" mt={10}>
          <Button onPress={handleClick}></Button>
          {posts.map(item => {
            return <PostCard />;
          })}
        </VStack>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default Home;
