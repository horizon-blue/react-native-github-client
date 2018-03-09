import React, { PureComponent } from 'react';
import { Container, Content, Text } from 'native-base';
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';

const repoInfo = gql`
  fragment RepoInfo on Repository {
    id
    name
    description
    viewerHasStarred
    primaryLanguage {
      id
      color
      name
    }
    forkCount
    stargazers {
      totalCount
    }
  }
`;

@graphql(
  gql`
    query {
      viewer {
        id
        repositories(affiliations: OWNER, last: 10) {
          totalCount
          edges {
            node {
              ...RepoInfo
            }
          }
        }
      }
    }
    ${repoInfo}
  `,
  { skip: props => props.isStarredPage }
)
@graphql(
  gql`
    query {
      viewer {
        id
        starredRepositories(last: 10) {
          totalCount
          edges {
            node {
              ...RepoInfo
            }
          }
        }
      }
    }
    ${repoInfo}
  `,
  { skip: props => !props.isStarredPage }
)
class RepositoryList extends PureComponent<Props> {
  render = () => {
    return (
      <Container>
        <Content>
          <Text>{JSON.stringify(this.props.data.viewer, null, 4)}</Text>
        </Content>
      </Container>
    );
  };
}

type Props = {
  data: {
    loading: Boolean,
    viewer: Object,
  },
  navigator: Object,
  isStarredPage: Boolean,
};

export default RepositoryList;
