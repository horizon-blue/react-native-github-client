import { AsyncStorage } from 'react-native';
import { gql } from 'apollo-boost';
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
  AsyncStorage.getItem('token').then(token =>
    fetch(`https://api.github.com/user/following/${login}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': 0,
        Authorization: `Bearer ${token}`,
      },
    }).then(() =>
      client.query({ query: refreshUser, fetchPolicy: 'network-only' })
    )
  );
