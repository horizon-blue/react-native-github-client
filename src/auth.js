import { Navigation } from 'react-native-navigation';
import { AsyncStorage } from 'react-native';

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

export const logout = () =>
  AsyncStorage.removeItem('token')
    .then(login)
    .catch(err => console.log(err));
