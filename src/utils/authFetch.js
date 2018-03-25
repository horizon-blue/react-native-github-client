import { AsyncStorage } from 'react-native';
import axios from 'axios';

/**
 * A helper function to send request to GitHub REST Api with Authentication
 * @param  {String} url     api endpoint to send request
 * @param  {String} method  one of 'get', 'post', 'put', and 'delete'
 * @param  {Object} config  rest of configuration
 * @return {Promise}        the request itself
 */
const authFetch = (url, method, config) =>
  AsyncStorage.getItem('token').then(token =>
    axios({
      url,
      method,
      ...config,
      headers: {
        'User-Agent': 'React Native GitHub Client',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
        ...config.headers,
      },
    })
  );

export default authFetch;
