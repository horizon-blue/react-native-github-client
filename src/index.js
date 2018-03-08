import { Navigation } from 'react-native-navigation';
import { AsyncStorage } from 'react-native';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import registerScreens from './src/screens';
// Due to security reason, I cannot include this file in version control
// Please follow this link if you want to generate your own personal token:
// https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/
import { GITHUB_TOKEN } from './config';

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: async (operation) => {
    const token = await AsyncStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: `Bearer ${token || GITHUB_TOKEN}`,
      },
    });
  },
});

registerScreens(client.store, ApolloProvider, client);

Navigation.startTabBasedApp({
  tabs: [
    {
      label: 'One',
      screen: 'profile.main', // this is a registered name for a screen
      title: 'Screen One',
    },
    {
      label: 'Two',
      screen: 'profile.main',
      title: 'Screen Two',
    },
  ],
});
