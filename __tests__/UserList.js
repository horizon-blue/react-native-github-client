import 'react-native';
import React from 'react';
import UserListView from '../src/components/User/UserListView';

import renderer from 'react-test-renderer';

it('user list view render correctly', () => {
  expect(
    renderer
      .create(
        <UserListView
          refetch={() => null}
          fetchMore={() => null}
          users={userList}
        />
      )
      .toJSON()
  ).toMatchSnapshot();
});

it('user list empty', () => {
  expect(
    renderer
      .create(
        <UserListView refetch={() => null} fetchMore={() => null} users={[]} />
      )
      .toJSON()
  ).toMatchSnapshot();
});

const userList = [
  {
    node: {
      id: 'asdf',
      name: 'foo bar',
      login: 'asdf',
      viewerIsFollowing: true,
      avatarUrl: '',
      bio: 'Computational statistician, programmer and data scientist.',
    },
  },
  {
    node: {
      id: 'fooo',
      name: 'a',
      login: 'asdf',
      viewerIsFollowing: false,
      avatarUrl: 'ad/',
      bio: '',
    },
  },
];
