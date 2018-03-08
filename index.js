import { Navigation } from 'react-native-navigation';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import registerScreens from './screens';

const client = new ApolloClient({ uri: 'https://api.github.com/graphql' });

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
