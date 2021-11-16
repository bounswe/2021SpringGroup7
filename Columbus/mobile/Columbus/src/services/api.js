import axios from 'axios';

export const API_INSTANCE = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-applicationid': '1',
  },
});

const apiUrl =
  'http://ec2-18-197-57-123.eu-central-1.compute.amazonaws.com:8000';

export const loginRequest = data => {
  console.log('asdasdasd');
  return API_INSTANCE.post(`${apiUrl}/guest/login/`, data)
    .then(result => result)
    .catch(error => error);
};
