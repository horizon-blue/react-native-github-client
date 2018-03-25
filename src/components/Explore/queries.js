import { gql } from 'apollo-boost';
import { authFetch } from 'utils';
import { repoFields } from '../Repository/queries';

export const getEvent = (page = 1) =>
  authFetch('https://api.github.com/user', 'get').then(res =>
    authFetch(res.data.received_events_url, 'get', {
      params: { page, per_page: 10 },
    })
  );

const repoFragment = gql`
fragment RepoFragment on Repository {
  ${repoFields}
}
`;

export const searchQuery = gql`
  query($query: String!, $type: SearchType!, $before: String) {
    search(query: $query, type: $type, last: 10, before: $before) {
      edges {
        node {
          ...RepoFragment
        }
      }
    }
  }
  ${repoFragment}
`;
