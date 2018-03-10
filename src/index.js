import { Navigation } from 'react-native-navigation';
import { AsyncStorage } from 'react-native';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import SplashScreen from 'react-native-splash-screen';

import registerScreens from './screens';
// Due to security reason, I cannot include this file in version control
// Please follow this link if you want to generate your own personal token:
// https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/
import { GITHUB_TOKEN } from './config';
import loadIcons from './utils/loadIcons';
import disableWarning from './utils/disableWarning';

disableWarning();

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

registerScreens(client.store, ApolloProvider, client);

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
      initialTabIndex: 1,
    },
  });
};

loadIcons(['user', 'globe'])
  .then(run)
  .then(() => SplashScreen.hide())
  .catch(error => console.error(error));
