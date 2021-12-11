import React, {useState, useEffect} from 'react';
import {
  Input,
  Button,
  Image,
  View,
  FormControl,
  Box,
  HStack,
  Text,
  Link,
} from 'native-base';

import AuthLayout from '../../layouts/AuthLayout';
import CustomModal from '../../components/CustomModal';
import {SERVICE} from '../../services/services';
import {useMutation} from 'react-query';

const Register = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [render, setRender] = useState(false);
  const [errors, setErrors] = useState({
    username: false,
    email: false,
    password: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    // This effect uses the `value` variable,
    // so it "depends on" `value`.
    console.log(errors);
  }, [username, email, password]);

  const handleResetAllState = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setErrors('');
  };

  const submitRegister = useMutation(
    params => SERVICE.registerRequest({params}),
    {
      onSuccess(response) {
        console.log('response: ', response.data);
        setModalMessage(response.data.return);
        handleResetAllState();
        setIsButtonLoading(false);
        setShowModal(true);
        // navigation.navigate('Login');
      },
      onError({response}) {
        console.log('res error: ', response.data.return);
        setIsButtonLoading(false);
        setModalMessage(response.data.return);
        setShowModal(true);
      },
    },
  );

  const sendRequest = async () => {
    const data = JSON.stringify({
      username: username,
      email: email,
      password: password,
      first_name: '',
      last_name: '',
    });

    try {
      await submitRegister.mutateAsync(data);
    } catch (e) {
      console.log('e: ', e);
      setIsButtonLoading(false);
      setModalMessage('Beklenmedik bir hata oluştu!');
      setShowModal(true);
    }
  };

  const validate = () => {
    console.log(errors);
    temp = errors;
    if (username === undefined || username.length < 3) {
      temp.username = true;
    } else {
      temp.username = false;
    }

    if ((password === undefined) | (password.length < 8)) {
      temp.password = true;
    } else {
      temp.password = false;
    }
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      temp.email = true;
    } else {
      temp.email = false;
    }
    if (
      temp.username == false &&
      temp.email == false &&
      temp.password == false
    ) {
      setIsButtonLoading(true);
      sendRequest();
    }
    setRender(!render);
    setErrors(temp);
  };
  const getErrors = () => {
    return errors;
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  return (
    <AuthLayout>
      <Box safeArea p="2" py="8" h="100%" w="90%" maxW="290">
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../../assets/logo/Columbus.png')}
            alt="Columbus Logo"
          />
        </View>
        <FormControl isRequired isInvalid={getErrors().username}>
          <FormControl.Label _text={{bold: true}}>Username</FormControl.Label>
          <Input
            variant="filled"
            placeholder="JohnSmith"
            onChangeText={value => setUsername(value)}
          />
          <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>
            Username should contain at least 3 character.
          </FormControl.ErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={getErrors().email}>
          <FormControl.Label _text={{bold: true}}>Email</FormControl.Label>
          <Input
            variant="filled"
            placeholder="johnsmith@example.com"
            onChangeText={value => setEmail(value)}
          />

          <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>
            Enter a valid Email address
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={getErrors().password}>
          <FormControl.Label _text={{bold: true}}>Password</FormControl.Label>
          <Input
            variant="filled"
            type="password"
            placeholder="Minimum 8 character"
            onChangeText={value => setPassword(value)}
          />

          <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>
            Password should contain 8 characters
          </FormControl.ErrorMessage>
        </FormControl>

        <Button onPress={() => validate()} isLoading={isButtonLoading}>
          Register
        </Button>
        <HStack mt="6" justifyContent="center">
          <Text
            fontSize="sm"
            color="coolGray.600"
            _dark={{
              color: 'warmGray.200',
            }}>
            I have an account.
          </Text>
          <Link
            _text={{
              color: 'indigo.500',
              fontWeight: 'medium',
              fontSize: 'sm',
            }}
            onPress={() => navigation.navigate('Login')}>
            Sign In
          </Link>
        </HStack>
        <CustomModal
          showModal={showModal}
          closeModal={closeModal}
          message={modalMessage}
        />
      </Box>
    </AuthLayout>
  );
};

export default Register;
