import { Navigation } from 'react-native-navigation';

import App from './App';

// register all screens of the app (including internal ones)
export default () => {
  Navigation.registerComponent('profile.main', () => App);
};
