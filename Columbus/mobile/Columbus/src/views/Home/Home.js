import React from 'react';
import {View, Text} from 'react-native';
import {Button} from 'native-base';

import {useAuth} from '../../context/AuthContext';

const Home = () => {
  const {logout} = useAuth();

  const handleLogout = async () => {
    logout();
  };

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
