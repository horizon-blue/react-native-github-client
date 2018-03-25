import { Navigation } from 'react-native-navigation';
import SplashScreen from 'react-native-splash-screen';

import { registerScreens, registerGraphQLScreens } from './screens';
import { loadIcons, disableWarning } from 'utils';
import getClient from './client';
import { login, logout } from './auth';

disableWarning();

// Register all screens using react-native-navigation
registerScreens();

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
        navigatorButtons: {
          rightButtons: [
            {
              id: 'search',
              icon: icons.search,
            },
          ],
        },
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
loadIcons(['user', 'globe', 'search'])
  .then(resources => (icons = resources))
  .then(() => SplashScreen.hide())
  .then(login)
  .then(getClient)
  .then(registerGraphQLScreens)
  .then(run)
  .catch(error => console.error(error));
