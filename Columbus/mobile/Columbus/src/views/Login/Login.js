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
import {SERVICE} from '../../services/services';
import CustomModal from '../../components/CustomModal';

const Login = ({navigation}) => {
  const [formData, setData] = useState({username: '', password: ''});
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

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  const handleLogin = async () => {
    setIsButtonLoading(true);

    const data = JSON.stringify({
      user_name: formData.username,
      password: formData.password,
    });

    await SERVICE.loginRequest(data)
      .then(response => {
        setIsButtonLoading(false);
        if (response.status === 200) {
          navigation.navigate('HomePage');
        } else {
          setModalMessage(response.return);
          setShowModal(true);
        }
      })
      .catch(() => {
        setModalMessage('Beklenmedik bir hata oluştu!');
        setShowModal(true);
        setIsButtonLoading(false);
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
        <CustomModal
          showModal={showModal}
          closeModal={closeModal}
          message={modalMessage}
        />
      </Box>
    </AuthLayout>
  );
};

export default Login;
