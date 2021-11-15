import React from 'react';
import {Button} from 'native-base';
import AuthLayout from '../../layout/AuthLayout';

const Register = ({navigation}) => {
  return (
    <AuthLayout pageHeader="Columbus Register">
      <Button onPress={() => navigation.navigate('Login')}>
        Go To Register
      </Button>
    </AuthLayout>
  );
};

export default Register;
