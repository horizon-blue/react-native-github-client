import { Navigation } from 'react-native-navigation';
import { ApolloProvider } from 'react-apollo';
import SplashScreen from 'react-native-splash-screen';

import registerScreens from './screens';
import { loadIcons, disableWarning } from 'utils';
import client from './client';
import { login, logout } from './auth';

disableWarning();

// Register all screens using react-native-navigation
registerScreens(client.store, ApolloProvider, client);

let icons = {};
/**
 * A function, when execute, start the main app with two tabs
 * @param  {Object} icons  key-values pair where each key corresponds to an
 *                         iocn name and each value corresponds to an image
 *                         resource
 */
const run = () => {
  Navigation.startTabBasedApp({
    tabs: [
      {
        label: 'Explore',
        screen: 'explore', // placeholder
        title: 'Explore',
        icon: icons.globe,
      },
      {
        label: 'User',
        screen: 'profile.user',
        title: 'Profile',
        icon: icons.user,
        passProps: {
          logout,
        },
      },
    ],
  });
};

// load the icons and start the main app
loadIcons(['user', 'globe'])
  .then(resources => (icons = resources))
  .then(login)
  .then(run)
  .then(() => SplashScreen.hide())
  .catch(error => console.error(error));
