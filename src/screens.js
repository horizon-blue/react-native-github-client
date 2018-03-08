import { Navigation } from 'react-native-navigation';

import Home from './Home';

// register all screens of the app (including internal ones)
export default (store, Provider, client) => {
  Navigation.registerComponent('profile.main', () => Home, store, Provider, { client });
};
