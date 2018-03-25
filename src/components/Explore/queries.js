import gql from 'graphql-tag';
import { authFetch } from 'utils';
import { repoFields } from '../Repository/queries';

export const getEvent = (page = 1) =>
  authFetch('https://api.github.com/user', 'get').then(res =>
    authFetch(res.data.received_events_url, 'get', {
      params: { page, per_page: 10 },
    })
  );

export const searchQuery = gql`
  query($query: String!, $type: SearchType!, $before: String) {
    search(query: $query, type: $type, last: 10, before: $before) {
      edges {
        node {
          ...on Repository {
            ${repoFields}
          }
        }
      }
    }
  }
`;
