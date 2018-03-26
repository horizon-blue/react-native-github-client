import 'react-native';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import RepositoryListView from '../src/components/Repository/RepositoryListView';

import renderer from 'react-test-renderer';

const repoList = [
  {
    node: {
      id: 'as123oisdf',
      nameWithOwner: 'foo/bar',
      name: 'bar',
      description: '..',
      viewerHasStarred: true,
      primaryLanguage: null,
      url: '',
      isPrivate: false,
      forkCount: 23,
      stargazers: {
        totalCount: 5,
      },
    },
  },
  {
    node: {
      id: 'asdlkf23sdf',
      nameWithOwner: 'segmentation/fault',
      name: 'fault',
      description: 'something to test',
      viewerHasStarred: false,
      primaryLanguage: {
        id: 'dfd2asdf',
        color: '#0000ff',
        name: 'whocares',
      },
      url: '',
      isPrivate: true,
      forkCount: 0,
      stargazers: {
        totalCount: 5,
      },
    },
  },
];

it('repository list view render correctly', () => {
  expect(
    renderer
      .create(
        <ApolloProvider client={{}}>
          <RepositoryListView
            refetch={() => null}
            fetchMore={() => null}
            repositories={repoList}
          />
        </ApolloProvider>
      )
      .toJSON()
  ).toMatchSnapshot();
});

it('repository list empty', () => {
  expect(
    renderer
      .create(
        <ApolloProvider client={{}}>
          <RepositoryListView
            refetch={() => null}
            fetchMore={() => null}
            repositories={[]}
          />
        </ApolloProvider>
      )
      .toJSON()
  ).toMatchSnapshot();
});
