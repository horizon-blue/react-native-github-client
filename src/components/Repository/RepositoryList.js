import React, { PureComponent } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Container, Text, List, ListItem } from 'native-base';
import { graphql } from 'react-apollo';
import _ from 'lodash/fp';

import { REPOSITORIES, STARRED_REPOSITORIES } from './queries';
import { deepMerge, openURL } from 'Profile/src/utils';

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
    repositories: _.reverse(repo.edges),
    fetchMore: () =>
      fetchMore({
        variables: { before: _.first(repo.edges).cursor },
        updateQuery: (previousResult, { fetchMoreResult }) =>
          deepMerge(fetchMoreResult, previousResult),
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
  renderRepo = ({ item: { node } }) => (
    <ListItem
      onPress={openURL(node.url)}
      style={node.isPrivate ? styles.privateRepo : null}
    >
      <Text>{node.name}</Text>
      <Text note>{JSON.stringify(node, null, 4)}</Text>
    </ListItem>
  );

  repoKeyExtractor = repo => repo.node.id;

  render = () => {
    console.log(this.props.repositories);
    return (
      <Container>
        <List>
          <FlatList
            data={this.props.repositories}
            renderItem={this.renderRepo}
            keyExtractor={this.repoKeyExtractor}
            onEndReached={this.props.fetchMore}
          />
        </List>
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

const styles = StyleSheet.create({
  privateRepo: {
    backgroundColor: '#FFFDF0',
  },
});

export default RepositoryList;
