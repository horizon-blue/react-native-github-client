import { Navigation } from 'react-native-navigation';
import { AsyncStorage } from 'react-native';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import SplashScreen from 'react-native-splash-screen';

import registerScreens from './screens';
/*
Due to security reason, I cannot include this file in version control
Please follow this link if you want to generate your own personal token:
https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/
 */
import { GITHUB_TOKEN } from './config';
import { loadIcons, disableWarning } from 'utils';

disableWarning();

/**
 * Initialize the Appolo client to connect to the graphql API at github
 * Try to get the token from AsyncStorage, and fall back to the GITHUB_TOKEN
 * stored in ./config.js if no token is found
 * @type {ApolloClient}
 */
const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: async operation => {
    const token = await AsyncStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: `Bearer ${token || GITHUB_TOKEN}`,
      },
    });
  },
});

// Register all screens using react-native-navigation
registerScreens(client.store, ApolloProvider, client);

/**
 * A function, when execute, start the main app with two tabs
 * @param  {Object} icons  key-values pair where each key corresponds to an
 *                         iocn name and each value corresponds to an image
 *                         resource
 */
const run = icons => {
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
      },
    ],
    tabsStyle: {
      // set initial screen to User page because explore page hasn't been
      // implemented yet
      initialTabIndex: 1,
    },
  });
};

// load the icons and start the main app
loadIcons(['user', 'globe'])
  .then(run)
  .then(() => SplashScreen.hide())
  .catch(error => console.error(error));
