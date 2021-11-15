import React from 'react';
import {Input, Button} from 'native-base';
import AuthLayout from '../../layout/AuthLayout'; 

const Login = ({navigation}) => {
  return (
    <AuthLayout pageHeader="Columbus Login">
      <Input variant="filled" placeholder="Outline" />
      <Button onPress={() => navigation.navigate('Register')}>
        Go To Register
      </Button>
    </AuthLayout>
  );
};

export default Login;
