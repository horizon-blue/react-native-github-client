import gql from 'graphql-tag';
import { authFetch } from 'utils';
import { repoFields } from '../Repository/queries';
import { userFields } from '../User/queries';

export const getEvent = (page = 1) =>
  authFetch('https://api.github.com/user', 'get').then(res =>
    authFetch(res.data.received_events_url, 'get', {
      params: { page, per_page: 10 },
    })
  );

export const searchQuery = gql`
  query($query: String!, $type: SearchType!, $after: String) {
    search(query: $query, type: $type, first: 10, after: $after) {
      edges {
        node {
          ...on Repository {
            ${repoFields}
          }
          ...on User {
            ${userFields}
          }
          ...on Organization {
            id
            avatarUrl
            login
            bio:description
            name
            url
          }
        }
        cursor
      }
    }
  }
`;
