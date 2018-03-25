import gql from 'graphql-tag';

export const addStar = gql`
  mutation($starrableId: ID!) {
    addStar(input: { starrableId: $starrableId }) {
      starrable {
        viewerHasStarred
        ... on Repository {
          id
        }
      }
    }
  }
`;

export const removeStar = gql`
  mutation($starrableId: ID!) {
    removeStar(input: { starrableId: $starrableId }) {
      starrable {
        viewerHasStarred
        ... on Repository {
          id
        }
      }
    }
  }
`;
