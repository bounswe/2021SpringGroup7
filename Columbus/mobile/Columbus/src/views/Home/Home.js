import React from 'react';
import {View, Text} from 'react-native';
import {Button} from 'native-base';
import PostCard from '../../components/PostCard'

import {useAuth} from '../../context/AuthContext';
import {
  Center,
  NativeBaseProvider,
} from "native-base"

const Home = () => {
  const {logout} = useAuth();

  const handleLogout = async () => {
    logout();
  };

  return (
   <NativeBaseProvider>
      <Center flex={1} px="3">
        <PostCard/>
       
      </Center>
    </NativeBaseProvider>
      
      
      
  );
};

export default Home;
