import React, { useState ,useEffect}  from 'react';
import {Input, Button,Image,View,FormControl,} from 'native-base';
import axios from 'axios';

import AuthLayout from '../../layout/AuthLayout';

const Register = ({navigation}) => {
  
  const url='http://ec2-35-158-103-6.eu-central-1.compute.amazonaws.com:8000/api/guest/register'
  const [firstName, setFirstName]=useState('')
  const [lastName, setLastName]=useState( '')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [render,setRender]=useState(false)
  const [errors, setErrors] = useState({firstName:false,lastName:false,email:false,password:false});
  

  
  useEffect(() => {
  // This effect uses the `value` variable,
  // so it "depends on" `value`.
  console.log(errors);
  }, [firstName,lastName,email,password])

  const sendRequest=()=>{
    const params = JSON.stringify({
      'user_name':'john_sim ',
    "user_email": email,
'second_name':'Can ',
    "password": password,
    'first_name':firstName,
    'last_name':lastName,

    });
    console.log(params)
   
    axios.post(url, params,{
      "headers": {
      "content-type": "application/json",
      Accept: "application/json",
    "x-applicationid": "1",
      },
    })
    .then((response)=> {
      console.log(response);
    })
    .catch((error)=> {
      console.log(error);
    });
    



  }

  const validate = () => {
    console.log(errors)
    temp=errors
    if ((firstName ===undefined) || (firstName.length < 3)) {
      
      temp.firstName=true
    }
    else{
      temp.firstName=false
    }
    if ((lastName ===undefined) || (lastName.length < 3)) {
      temp.lastName=true
    } 
    else{
      temp.lastName=false
    }
    
    if ((password===undefined) | (password.length <8) ) {
      temp.password=true
    }
    else{
      temp.password=false
    }
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false){
      temp.email=true
    }
    else{
      temp.email=false
    }
    if(temp.firstName==false && temp.lastName==false && temp.email==false && temp.password==false ){
      sendRequest()
      
    }
    setRender(!render)
    setErrors(temp)
    setErrors(temp)


  };
  const getErrors=()=>{
    return errors;
  }
  


  return (
    <AuthLayout>
      <View style={{justifyContent: 'center', marginTop:-100,
    alignItems: 'center'}}>
    
      <Image source={require('../../assets/logo/Columbus.png')} 
      style={{  maxHeight: 200}} 
      alt='Columbus Registerr'/>
      </View>
      <FormControl isRequired isInvalid={getErrors().firstName}>
        <FormControl.Label _text={{bold: true}}>First Name</FormControl.Label>
        <Input
          placeholder="John"
          onChangeText={(value) => setFirstName( value )}
        />
        <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>First Name should contain at least 3 character.</FormControl.ErrorMessage>
      
        
      </FormControl>
      <FormControl isRequired isInvalid={getErrors().lastName}>
        <FormControl.Label _text={{bold: true}}>Last Name</FormControl.Label>
        <Input
          placeholder="Smith"
          onChangeText={(value) => setLastName( value )}
        />
        <FormControl.ErrorMessage _text={{fontSize: 'xs'}}>Last Name should contain at least 3 character.</FormControl.ErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={getErrors().email}>
        <FormControl.Label _text={{bold: true}}>Email</FormControl.Label>
        <Input
          placeholder="johnsmith@example.com"
          onChangeText={(value) => setEmail( value )}
        />
       
        <FormControl.ErrorMessage _text={{fontSize: 'xs'}}> Enter a valid Email address</FormControl.ErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={getErrors().password}>
        <FormControl.Label _text={{bold: true}}>Password</FormControl.Label>
        <Input
          type="password"
          placeholder="Minimum 8 character"
          onChangeText={(value) => setPassword( value )}
        />
        
        <FormControl.ErrorMessage _text={{fontSize: 'xs'}}> Password should contain 8 characters</FormControl.ErrorMessage>
      </FormControl>
      
      <Button onPress={() => validate()}>
        Register
      </Button>
      <Button onPress={() => navigation.navigate('Login')}>
        Go To Login
      </Button>
    </AuthLayout>
  );
};

export default Register;
