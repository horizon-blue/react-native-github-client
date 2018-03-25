import { AsyncStorage } from 'react-native';
import axios from 'axios';

/**
 * A helper function to send request to GitHub REST Api with Authentication
 * @param  {String} url     api endpoint to send request
 * @param  {String} method  one of 'get', 'post', 'put', and 'delete'
 * @param  {Object} headers extra content (beside authentication) to send
 * @return {Promise}        the request itself
 */
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
