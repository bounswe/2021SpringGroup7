import React from 'react';
import {Center, Stack} from 'native-base';

const AuthLayout = ({children}) => {
  return (
    <Center backgroundColor="white">
      <Stack
        space={4}
        w={{
          base: '75%',
          md: '25%',
        }}>
        {children}
      </Stack>
    </Center>
  );
};

export default AuthLayout;