import { Navigation } from 'react-native-navigation';
import { AsyncStorage } from 'react-native';
import _ from 'lodash/fp';
import getClient from './client';

export const login = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    return new Promise(resolve => {
      Navigation.showModal({
        screen: 'profile.user.login',
        title: 'Login',
        passProps: {
          onSubmit: token => {
            Navigation.dismissModal();
            resolve(AsyncStorage.setItem('token', token));
          },
        },
      });
    });
  }
};

const onlogout = {};
export const addLogoutListener = (key, callback) => {
  onlogout[key] = callback;
};

export const removeLogoutListener = key => {
  delete onlogout[key];
};

export const logout = () => {
  AsyncStorage.removeItem('token')
    .then(login)
    .then(getClient)
    .then(client => client.resetStore())
    // execute each callback
    .then(() => _.flow(_.values, _.forEach(callback => callback()))(onlogout))
    .catch(err => console.error(err));
};
