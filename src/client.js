import { AsyncStorage } from 'react-native';
import { ApolloClient } from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { from } from 'apollo-link';
import { authFetch } from 'utils';

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

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
const getClient = function() {
  if (this.client) return this.client;

  // Get a fragment mathcer (for use in union type). Reference:
  // https://www.apollographql.com/docs/react/advanced/fragments.html#fragment-matcher
  return authFetch(GITHUB_GRAPHQL_API, 'post', {
    data: JSON.stringify({
      query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
    }),
  })
    .then(res => res.data)
    .then(result => {
      // filtering out any type information unrelated to unions or interfaces
      const filteredData = result.data.__schema.types.filter(
        type => type.possibleTypes !== null
      );
      result.data.__schema.types = filteredData;
      return result.data;
    })
    .then(
      introspectionQueryResultData =>
        new IntrospectionFragmentMatcher({
          introspectionQueryResultData,
        })
    )
    .then(fragmentMatcher => new InMemoryCache({ fragmentMatcher }))
    .then(cache => {
      this.client = new ApolloClient({
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
            uri: GITHUB_GRAPHQL_API,
          }),
        ]),
        cache,
      });
      return this.client;
    });
};

export default getClient;
