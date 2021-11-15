import React, {useEffect, useState} from 'react';
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  HStack,
  Link,
  Image,
  Center,
} from 'native-base';

import AuthLayout from '../../layout/AuthLayout';

const Login = ({navigation}) => {
  const [formData, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [disableButton, setDisableButton] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    let reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (reg.test(formData.email) === true) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [formData]);

  const handleLogin = () => {
    setIsButtonLoading(true);
    console.log('formData: ', formData);
  };

  return (
    <AuthLayout>
      <Box safeArea p="2" py="8" h="100%" w="90%" maxW="290">
        <Heading
          size="lg"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: 'warmGray.50',
          }}>
          Welcome
        </Heading>
        <Heading
          mt="1"
          _dark={{
            color: 'warmGray.200',
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="xs">
          Sign in to continue!
        </Heading>
        <Center mt={5}>
          <Image
            borderRadius={100}
            source={{
              uri: 'https://wallpaperaccess.com/full/317501.jpg',
            }}
            alt="Alternate Text"
            size="xl"
          />
        </Center>
        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              variant="filled"
              placeholder="test@gmail.com"
              onChangeText={value => setData({...formData, mail: value})}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              variant="filled"
              type="password"
              onChangeText={value => setData({...formData, password: value})}
            />
          </FormControl>
          <Button
            isDisabled={disableButton}
            isLoading={isButtonLoading}
            mt="2"
            onPress={handleLogin}>
            Sign in
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.600"
              _dark={{
                color: 'warmGray.200',
              }}>
              I'm a new user.
            </Text>
            <Link
              _text={{
                color: 'indigo.500',
                fontWeight: 'medium',
                fontSize: 'sm',
              }}
              onPress={() => navigation.navigate('Register')}>
              Sign Up
            </Link>
          </HStack>
        </VStack>
      </Box>
    </AuthLayout>
  );
};

export default Login;
