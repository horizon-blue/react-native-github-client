import 'react-native';
import React from 'react';
import { UserView } from '../src/components/User/User';

import renderer from 'react-test-renderer';

const viewer = {
  id: 'asdf',
  login: 'foobar',
  email: 'example@example.com',
  bio: 'a test',
  name: 'Test Render',
  avatarUrl: '',
  websiteUrl: 'example.com',
  company: 'segfault llc',
  createdAt: '2012-02-12T01:54:15Z',
  location: 'North Pole',
  isViewer: false,
  viewerIsFollowing: true,
  followers: {
    totalCount: 10,
  },
  following: {
    totalCount: 5,
  },
  repositories: {
    totalCount: 4,
  },
  starredRepositories: {
    totalCount: 6,
  },
};

it('user view render correctly', () => {
  expect(
    renderer
      .create(
        <UserView
          refetch={() => null}
          viewer={viewer}
          data={{ loading: false }}
        />
      )
      .toJSON()
  ).toMatchSnapshot();
});

it('user view loading', () => {
  expect(
    renderer
      .create(<UserView refetch={() => null} data={{ loading: true }} />)
      .toJSON()
  ).toMatchSnapshot();
});

it('user view error', () => {
  expect(
    renderer
      .create(
        <UserView
          refetch={() => null}
          data={{ loading: false, error: 'Test Error' }}
        />
      )
      .toJSON()
  ).toMatchSnapshot();
});
