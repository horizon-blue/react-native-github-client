import { AsyncStorage } from 'react-native';
import ApolloClient from 'apollo-boost';

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
        authorization: `Bearer ${token}`,
      },
    });
  },
});

export default client;
