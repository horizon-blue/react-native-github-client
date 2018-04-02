import React from 'react';
import { getQuery } from './queries';
import { warpQueries } from 'utils';
import UserListView from './UserListView';
import Container from 'SafeContainer';

const UserWithQuery = warpQueries(getQuery, 'userType', 'users')(UserListView)([
  'followers',
  'following',
]);

export default props => (
  <Container>
    <UserWithQuery {...props} searchEnabled />
  </Container>
);
