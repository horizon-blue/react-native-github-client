import { gql } from 'apollo-boost';
import { authFetch } from 'utils';

import client from '../../client';

const refreshUser = gql`
  query($login: String!) {
    user(login: $login) {
      id
      viewerIsFollowing
    }
  }
`;

// GitHub GraphQL API does not have follow / unfollow functionality yet
export const followUser = login => () =>
  authFetch(`https://api.github.com/user/following/${login}`, 'put', {
    'Content-Length': 0,
  }).then(() =>
    client.query({
      query: refreshUser,
      fetchPolicy: 'network-only',
      variables: { login },
    })
  );

export const unfollowUser = login => () =>
  authFetch(`https://api.github.com/user/following/${login}`, 'delete', {
    'Content-Length': 0,
  }).then(() =>
    client.query({
      query: refreshUser,
      fetchPolicy: 'network-only',
      variables: { login },
    })
  );
