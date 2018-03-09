import { gql } from 'apollo-boost';

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
        edges {
          node {
            id
            nameWithOwner
            name
            description
            viewerHasStarred
            primaryLanguage {
              id
              color
              name
            }
            url
            isPrivate
            forkCount
            stargazers {
              totalCount
            }
          }
          cursor
        }
      }
    }
  }
`;
