import { Navigation } from 'react-native-navigation';

import App from './App';

// register all screens of the app (including internal ones)
export default (store, Provider, client) => {
  Navigation.registerComponent('profile.main', () => App, store, Provider, { client });
};
