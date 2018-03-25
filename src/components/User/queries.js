import gql from 'graphql-tag';

/**
 * Return the graphql query for given fields
 * @param  {String} field field to be quired
 * @param  {String} rest  optional, additional arguments
 * @return {Object}       graphql query
 */
export const getQuery = (
  field: String,
  rest: ?String,
  isViewer: Boolean
) => gql`
  query($before: String, ${isViewer ? '' : '$login: String!'}) {
    ${isViewer ? 'viewer' : 'user(login: $login)'} {
      id
      ${field}(last: 10, before: $before, ${rest || ''}) {
        totalCount
        edges {
          node {
            id
            name
            login
            viewerIsFollowing
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
export const getUserQuery = (_a, _b, isViewer) => gql`
   query${isViewer ? '' : '($login: String!)'} {
     ${isViewer ? 'viewer' : 'user(login: $login)'} {
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
      isViewer
      viewerIsFollowing
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
