import React, { PureComponent } from 'react';
// import {FlatList} from 'react-native';
import { Container, Content, Text, Button } from 'native-base';
import { graphql } from 'react-apollo';
import _ from 'lodash/fp';

import { REPOSITORIES, STARRED_REPOSITORIES } from './queries';
import { deepMerge } from 'Profile/src/utils';

/**
 * A helper function that transform fetched result to props
 * @param  {Object} ownProps  properties directly passed to component
 * @param  {Object} data      data fetched or creatd by Apollo client
 * @return {Object}           the transformed object
 */
const transformProps = ({ ownProps, data: { viewer, fetchMore, ...rest } }) => {
  if (rest.loading || rest.error)
    return {
      ...rest,
      fetchMore: () => {},
    };

  const { repositories, starredRepositories } = viewer;
  const repo = ownProps.isStarredPage ? starredRepositories : repositories;

  return {
    repositories: repo,
    fetchMore: () =>
      fetchMore({
        variables: { before: _.first(repo.edges).cursor },
        updateQuery: (previousResult, { fetchMoreResult }) =>
          deepMerge(previousResult, fetchMoreResult),
      }),
    ...rest,
  };
};

@graphql(REPOSITORIES, {
  skip: props => props.isStarredPage,
  props: transformProps,
})
@graphql(STARRED_REPOSITORIES, {
  skip: props => !props.isStarredPage,
  props: transformProps,
})
class RepositoryList extends PureComponent<Props> {
  render = () => {
    console.log(this.props.repositories);
    return (
      <Container>
        <Content>
          <Text>{JSON.stringify(this.props.repositories, null, 4)}</Text>
          <Button onPress={this.props.fetchMore}>
            <Text>Fecth More</Text>
          </Button>
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
