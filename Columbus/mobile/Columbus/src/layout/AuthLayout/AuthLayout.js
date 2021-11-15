import React from 'react';
import {Center, Flex, Heading, Stack} from 'native-base';

const AuthLayout = ({children}) => {
  return (
    <Center backgroundColor="orange.500">
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
