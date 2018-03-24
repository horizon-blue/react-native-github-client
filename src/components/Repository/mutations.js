import { gql } from 'apollo-boost';

export const addStar = gql`
  mutation($starrableId: String!) {
    addStar(input: { starrableId: $starrableId }) {
      starrable {
        viewerHasStarred
      }
    }
  }
`;
