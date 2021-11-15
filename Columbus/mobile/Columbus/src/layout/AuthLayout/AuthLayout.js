import React from 'react';
import {Center, Heading, Stack} from 'native-base';

const AuthLayout = ({pageHeader, children}) => {
  return (
    <Center pt={10}>
      <Stack
        space={4}
        w={{
          base: '75%',
          md: '25%',
        }}>
        <Center>
          <Heading textAlign="center" mb="10">
            {pageHeader}
          </Heading>
        </Center>
        {children}
      </Stack>
    </Center>
  );
};

export default AuthLayout;
