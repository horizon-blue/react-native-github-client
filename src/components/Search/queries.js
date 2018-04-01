import gql from 'graphql-tag';
import { repoFields } from '../Repository/queries';
import { userFields } from '../User/queries';

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
