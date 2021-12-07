import React from 'react';
import {View, Text} from 'react-native';
import {Button} from 'native-base';
import PostCard from '../../components/PostCard';

import {useAuth} from '../../context/AuthContext';
import {Center, NativeBaseProvider, ScrollView, VStack} from 'native-base';

const Home = () => {
  const {logout} = useAuth();

  const handleLogout = async () => {
    logout();
  };

  return (
    <NativeBaseProvider>
      <ScrollView>
        <VStack flex={1} px="3" space={10} alignItems="center" mt={10}>
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
        </VStack>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default Home;
