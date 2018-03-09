import { gql } from 'apollo-boost';

const REPO_INFO = `
edges {
  node {
    id
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
`;

export const REPOSITORIES = gql`
  query($before: String) {
    viewer {
      id
      repositories(affiliations: OWNER, last: 10, before: $before) {
        ${REPO_INFO}
      }
    }
  }
`;

export const STARRED_REPOSITORIES = gql`
  query($before: String) {
    viewer {
      id
      starredRepositories(last: 10, before: $before) {
        ${REPO_INFO}
      }
    }
  }
`;
