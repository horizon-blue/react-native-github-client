import { AsyncStorage } from 'react-native';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { from } from 'apollo-link';

// Add authentication. Reference:
// https://github.com/apollographql/apollo-client/blob/master/docs/source/recipes/authentication.md
const authLink = setContext((_, { headers }) =>
  AsyncStorage.getItem('token').then(token => ({
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  }))
);

/**
 * Initialize the Appolo client to connect to the graphql API at github
 * Try to get the token from AsyncStorage, and fall back to the GITHUB_TOKEN
 * stored in ./config.js if no token is found
 * @type {ApolloClient}
 */
const client = new ApolloClient({
  link: from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    authLink,
    createHttpLink({
      uri: 'https://api.github.com/graphql',
    }),
  ]),
  cache: new InMemoryCache(),
});

export default client;
