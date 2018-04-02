import gql from 'graphql-tag';
import { authFetch } from 'utils';

export const repoFields = `
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
  owner {
    id
    login
  }
  url
  isPrivate
  forkCount
  stargazers {
    totalCount
  }
`;

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
        edges {
          node {
            ${repoFields}
          }
          cursor
        }
      }
    }
  }
`;

export const getRepository = gql`
  query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      nameWithOwner
      description
      viewerHasStarred
      primaryLanguage {
        id
        color
        name
      }
      url
      forkCount
      stargazers {
        totalCount
      }
    }
  }
`;

export const getCommitActivity = (owner, name) =>
  authFetch(
    `https://api.github.com/repos/${owner}/${name}/stats/commit_activity`,
    'get'
  );
