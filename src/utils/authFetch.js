import { AsyncStorage } from 'react-native';
import axios from 'axios';

const authFetch = (url, method, headers) =>
  AsyncStorage.getItem('token').then(token =>
    axios({
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    })
  );

export default authFetch;
