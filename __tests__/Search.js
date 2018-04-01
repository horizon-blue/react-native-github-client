import 'react-native';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import Search from '../src/components/Search/Search';
import getClient from '../src/client';

import renderer from 'react-test-renderer';

it('search render correctly', () => {
  getClient().then(client =>
    expect(
      renderer
        .create(
          <ApolloProvider client={client}>
            <Search />
          </ApolloProvider>
        )
        .toJSON()
    ).toMatchSnapshot()
  );
});
