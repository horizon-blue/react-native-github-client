import React, { PureComponent } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Text, List, ListItem, Grid, Row, View } from 'native-base';
import Octicons from 'react-native-vector-icons/Octicons';
import { Mutation } from 'react-apollo';
import type { Node } from 'react';

import Container from 'SafeContainer';

import { getQuery } from './queries';
import { addStar, removeStar } from './mutations';
import { warpQueries, openWebView } from 'utils';
import SwipeRow from 'SwipeRow';

type Props = {
  data: {
    loading: Boolean,
  },
  repositories: [Object],
  fetchMore: Node => null,
  refetch: Node => null,
  navigator: Object,
  repoType: String,
  login: ?String,
};

/**
 * Display a List of Repositories
 * @extends PureComponent
 */
class RepositoryList extends PureComponent<Props> {
  state = {
    refreshing: false,
  };
  /**
   * Used in FlatList to make sure that each repo has a distinct key
   * @param  {Object} repo  object containing information for each repo
   * @return {String}      a unique key used to identify each row in list
   */
  repoKeyExtractor = repo => repo.node.id;

  /**
   * Renders the user object into a row in the list
   * @param  {Object} item the object containing information for each repository
   * @return {Node}       a React Native Node that can be rendered into a row
   *                      in the list
   */
  renderRepo = ({ item: { node } }) => (
    <Mutation mutation={addStar}>
      {addStar => (
        <Mutation mutation={removeStar}>
          {removeStar => (
            <View style={node.isPrivate ? styles.privateRepo : null}>
              <SwipeRow
                icon={
                  node.viewerHasStarred
                    ? {
                        name: 'star-border',
                        text: 'Unstar',
                        color: 'steelblue',
                      }
                    : { name: 'star', text: 'Star', color: 'goldenrod' }
                }
                onPressButton={() =>
                  (node.viewerHasStarred ? removeStar : addStar)({
                    variables: { starrableId: node.id },
                  })
                }
              >
                <ListItem
                  onPress={openWebView(node.url, this.props.navigator)}
                  style={styles.listItem}
                >
                  <Grid>
                    <Row>
                      <Octicons name="repo" size={18} />
                      <Text style={styles.repoName} numberOfLines={1}>
                        {this.props.repoType === 'repositories'
                          ? node.name
                          : node.nameWithOwner}
                      </Text>
                    </Row>
                    <Row style={styles.description}>
                      <Text note numberOfLines={3}>
                        {node.description || 'No description'}
                      </Text>
                    </Row>
                    <Row>
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
                      {!!node.stargazers.totalCount && (
                        <View style={styles.bottomTag}>
                          <Octicons size={15} name="star" />
                          <Text style={styles.bottomTagText}>
                            {node.stargazers.totalCount}
                          </Text>
                        </View>
                      )}
                      {!!node.forkCount && (
                        <View style={styles.bottomTag}>
                          <Octicons size={15} name="repo-forked" />
                          <Text style={styles.bottomTagText}>
                            {node.forkCount}
                          </Text>
                        </View>
                      )}
                    </Row>
                  </Grid>
                </ListItem>
              </SwipeRow>
            </View>
          )}
        </Mutation>
      )}
    </Mutation>
  );

  render = () => {
    return (
      <Container>
        <List>
          <FlatList
            data={this.props.repositories}
            renderItem={this.renderRepo}
            keyExtractor={this.repoKeyExtractor}
            onEndReached={this.props.fetchMore(this)}
            onRefresh={this.props.refetch(this)}
            refreshing={this.state.refreshing}
          />
        </List>
      </Container>
    );
  };
}

const styles = StyleSheet.create({
  privateRepo: {
    backgroundColor: '#FFFDF0',
  },
  listItem: { paddingRight: 10 },
  repoName: { fontWeight: 'bold', marginLeft: 5 },
  description: { marginVertical: 10 },
  bottomTag: { flexDirection: 'row' },
  bottomTagText: { fontSize: 14, marginRight: 10, marginLeft: 3 },
});

// Compose queires
export default warpQueries(getQuery, 'repoType', 'repositories')(
  RepositoryList
)([['repositories', 'affiliations: OWNER'], 'starredRepositories', 'watching']);
