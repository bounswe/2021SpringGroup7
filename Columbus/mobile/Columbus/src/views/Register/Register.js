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
  Modal,
} from 'native-base';
import axios from 'axios';

import AuthLayout from '../../layout/AuthLayout';
import CustomModal from '../../components/CustomModal';

const Register = ({navigation}) => {
  const url =
    'http://ec2-35-158-103-6.eu-central-1.compute.amazonaws.com:8000/guest/register/';
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

  const sendRequest = () => {
    const params = JSON.stringify({
      user_name: username,
      user_email: email,
      second_name: '',
      password: password,
      first_name: '',
      last_name: '',
    });
    console.log(params);

    axios
      .post(url, params, {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json',
          'x-applicationid': '1',
        },
      })
      .then(response => {
        console.log('response: ', response.status);
        if (response.status === 200) {
          setModalMessage('Successfully Register!');
          handleResetAllState();
        } else {
          setModalMessage('Register Failed!');
        }
        setShowModal(true);
        setIsButtonLoading(false);
      })
      .catch(error => {
        // console.log(error);
        setIsButtonLoading(false);
        setShowModal(true);
        setModalMessage('Register Failed!');
      });
  };

  const validate = () => {
    setIsButtonLoading(true);
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
      sendRequest();
    }
    setRender(!render);
    setErrors(temp);
  };
  const getErrors = () => {
    return errors;
  };

  return (
    <AuthLayout>
      <Box safeArea p="2" py="8" h="100%" w="90%" maxW="290">
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../../assets/Logo/Columbus.png')}
            style={{maxHeight: 200}}
            alt="Columbus Registerr"
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

        <Button onPress={() => validate()}>Register</Button>
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

export default Register;
