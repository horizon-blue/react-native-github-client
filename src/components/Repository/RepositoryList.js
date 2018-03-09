import React, { PureComponent } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Container, Text, List, ListItem, Grid, Row, View } from 'native-base';
import { graphql } from 'react-apollo';
import Octicons from 'react-native-vector-icons/Octicons';
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
      data: rest,
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
    data: rest,
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
    <View style={node.isPrivate ? styles.privateRepo : null}>
      <ListItem onPress={openURL(node.url)} style={styles.listItem}>
        <Grid>
          <Row>
            <Octicons name="repo" size={18} />
            <Text style={styles.repoName} numberOfLines={1}>
              {this.props.isStarredPage ? node.nameWithOwner : node.name}
            </Text>
          </Row>
          <Row style={styles.description}>
            <Text note numberOfLines={3}>
              {node.description || 'No description'}
            </Text>
          </Row>
          <Row>
            {!!node.forkCount && (
              <View style={styles.bottomTag}>
                <Octicons size={15} name="repo-forked" />
                <Text style={styles.bottomTagText}>{node.forkCount}</Text>
              </View>
            )}
            {!!node.stargazers.totalCount && (
              <View style={styles.bottomTag}>
                <Octicons size={15} name="star" />
                <Text style={styles.bottomTagText}>
                  {node.stargazers.totalCount}
                </Text>
              </View>
            )}
            {!!node.primaryLanguage && (
              <View style={styles.bottomTag}>
                <Octicons
                  size={15}
                  name="primitive-dot"
                  color={node.primaryLanguage.color}
                />
                <Text style={styles.bottomTagText}>
                  {node.primaryLanguage.name}
                </Text>
              </View>
            )}
          </Row>
        </Grid>
      </ListItem>
    </View>
  );

  repoKeyExtractor = repo => repo.node.id;

  render = () => {
    return (
      <Container>
        <List>
          <FlatList
            data={this.props.repositories}
            renderItem={this.renderRepo}
            keyExtractor={this.repoKeyExtractor}
            onEndReached={this.props.fetchMore}
            onEndReachedThreshold={0.01}
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
    marginLeft: 5,
  },
  listItem: { paddingRight: 10 },
  repoName: { fontWeight: 'bold' },
  description: { marginTop: 10, marginBottom: 10 },
  bottomTag: { flexDirection: 'row' },
  bottomTagText: { fontSize: 14, marginRight: 10, marginLeft: 3 },
});

export default RepositoryList;
