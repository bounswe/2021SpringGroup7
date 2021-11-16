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
  Modal,
} from 'native-base';
import axios from 'axios';

import AuthLayout from '../../layout/AuthLayout';

const Login = ({navigation}) => {
  const [formData, setData] = useState({username: '', password: ''});
  const [errors, setErrors] = useState({});
  const [isDisableButton, setIsDisableButton] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    if (formData?.username.length > 3 && formData?.password.length > 2) {
      setIsDisableButton(false);
    } else {
      setIsDisableButton(true);
    }
  }, [formData]);

  const handleLogin = async () => {
    setIsButtonLoading(true);

    const apiUrl =
      'http://ec2-35-158-103-6.eu-central-1.compute.amazonaws.com:8000/guest/login/';

    const data = JSON.stringify({
      user_name: formData.username,
      password: formData.password,
    });

    axios
      .post(apiUrl, data, {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json',
          'x-applicationid': '1',
        },
      })
      .then(response => {
        console.log('response: ', response);
        if (response.status === 200) {
          setIsButtonLoading(false);
          navigation.navigate('HomePage');
        } else {
          setModalMessage('Username or password is not correct');
          setShowModal(true);
          setIsButtonLoading(false);
        }
      })
      .catch(error => {
        setModalMessage('Username or password is not correct');
        setShowModal(true);
        setIsButtonLoading(false);
        console.log('error: ', error);
      });
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
            source={require('../../assets/Logo/Columbus.png')}
            alt="Columbus Registerr"
          />
        </Center>
        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Username</FormControl.Label>
            <Input
              variant="filled"
              placeholder="username"
              onChangeText={value => setData({...formData, username: value})}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              variant="filled"
              placeholder="Minimum 2 character"
              type="password"
              onChangeText={value => setData({...formData, password: value})}
            />
          </FormControl>
          <Button
            disabled={isDisableButton}
            isDisabled={isDisableButton}
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
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Info</Modal.Header>
            <Modal.Body>
              <Text style={{textAlign: 'center'}}>{modalMessage}</Text>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  onPress={() => {
                    setShowModal(false);
                  }}>
                  Ok
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Box>
    </AuthLayout>
  );
};

export default Login;
