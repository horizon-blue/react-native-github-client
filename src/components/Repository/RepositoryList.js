import React, { PureComponent } from 'react';
import { Container, Content } from 'native-base';
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';

@graphql(
  gql`
    query {
      viewer {
        repositories(affiliations: OWNER) {
          totalCount
        }
      }
    }
  `,
  { skip: props => props.isStarredPage }
)
@graphql(
  gql`
    query {
      viewer {
        starredRepositories {
          totalCount
        }
      }
    }
  `,
  { skip: props => !props.isStarredPage }
)
class RepositoryList extends PureComponent {
  render = () => {
    console.log(this.props);
    return (
      <Container>
        <Content />
      </Container>
    );
  };
}

export default RepositoryList;
