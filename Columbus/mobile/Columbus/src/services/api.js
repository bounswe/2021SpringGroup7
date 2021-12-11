import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import STATUS_CODES from '../constants/statusCodes';
import {AUTH_KEY, TEMP_MESSAGE_KEY} from '../constants/storageKeys';

const productionUrl =
  'http://ec2-35-158-103-6.eu-central-1.compute.amazonaws.com:8000';
const stageUrl =
  'http://ec2-18-197-57-123.eu-central-1.compute.amazonaws.com:8000';

export const API_INSTANCE = axios.create({
  baseURL: stageUrl,
  withCredentials: true,
  timeout: 1000 * 2,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-applicationid': '1',
  },
});

const redirectToLogin = navigation => {
  navigation.navigate('Login');
};

const errorInterceptor = async error => {
  const status = error.response?.status;
  const data = error.response?.data;
  if (status === STATUS_CODES.UNAUTHORIZED) {
    const navigation = useNavigation();
    await AsyncStorage.setItem(
      TEMP_MESSAGE_KEY,
      data.return || 'Beklenmedik bir hata oluştu.',
    );

    await AsyncStorage.removeItem(AUTH_KEY);

    redirectToLogin(navigation);
  }
  return Promise.reject(error);
};

API_INSTANCE.interceptors.response.use(undefined, errorInterceptor);
