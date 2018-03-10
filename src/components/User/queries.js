import { gql } from 'apollo-boost';
import { deepMerge } from 'Profile/src/utils';
import _ from 'lodash/fp';

/**
 * Return the graphql query for given fields
 * @param  {String} field field to be quired
 * @param  {String} rest  optional, additional arguments
 * @return {Object}       graphql query
 */
export const getQuery = (field: String, rest: ?String) => gql`
  query($before: String) {
    viewer {
      id
      ${field}(last: 10, before: $before, ${rest || ''}) {
        totalCount
        edges {
          node {
            id
            name
            login
            avatarUrl
            bio
          }
          cursor
        }
      }
    }
  }
`;

/**
 * Return the graphql query for given fields
 * @param  {String} login the username to be queried
 * @return {Object}       graphql query
 */
export const getUserQuery = (login: ?String) => gql`
  query {
    ${login ? `user(login: "${login}")` : 'viewer'} {
      id
      login
      email
      bio
      name
      avatarUrl
      websiteUrl
      company
      createdAt
      location
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(affiliations: OWNER) {
        totalCount
      }
      starredRepositories {
        totalCount
      }
    }
  }
`;
