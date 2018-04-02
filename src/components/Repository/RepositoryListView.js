import React, { PureComponent } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import {
  Text,
  List,
  ListItem,
  Grid,
  Row,
  View,
  Input,
  Item,
  Icon,
} from 'native-base';
import Octicons from 'react-native-vector-icons/Octicons';
import { Mutation } from 'react-apollo';
import type { Node } from 'react';
import _ from 'lodash';

import { addStar, removeStar } from './mutations';
import { openWebView } from 'utils';
import SwipeRow from 'SwipeRow';

type Props = {
  repositories: [Object],
  fetchMore: Node => null,
  refetch: Node => null,
  navigator: Object,
  repoType: ?String,
  login: ?String,
  searchEnabled: ?Boolean,
};

/**
 * Display a List of Repositories
 * @extends PureComponent
 */
class RepositoryListView extends PureComponent<Props> {
  static defaultProps = {
    search: false,
  };

  state = {
    refreshing: false,
    filtered: [],
    query: '',
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
                        color: 'firebrick',
                      }
                    : { name: 'star', text: 'Star', color: 'steelblue' }
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

  handleChangeQuery = query =>
    this.setState({
      query,
      filtered: query
        ? _.filter(this.props.repositories, this.repoFilter(query))
        : undefined,
    });

  repoFilter = query => ({ node }) =>
    _.includes(
      _.lowerCase(
        this.props.repoType === 'repositories' ? node.name : node.nameWithOwner
      ),
      _.lowerCase(query)
    );

  renderSearchBar = () => (
    <Item>
      <Icon active name="search" style={styles.icon} />
      <Input
        placeholder="Begin Searching..."
        onChangeText={this.handleChangeQuery}
        value={this.state.query}
        placeholderTextColor="darkgrey"
      />
    </Item>
  );

  render = () => (
    <List style={styles.listContainer}>
      <FlatList
        data={
          this.props.searchEnabled && this.state.query
            ? this.state.filtered
            : this.props.repositories
        }
        renderItem={this.renderRepo}
        ListHeaderComponent={this.props.searchEnabled && this.renderSearchBar}
        ListEmptyComponent={<Text>No Content</Text>}
        keyExtractor={this.repoKeyExtractor}
        onEndReached={this.props.fetchMore(this)}
        onRefresh={this.props.refetch(this)}
        refreshing={this.state.refreshing}
      />
    </List>
  );
}

const styles = StyleSheet.create({
  privateRepo: {
    backgroundColor: '#FFFDF0',
  },
  icon: {
    marginLeft: 10,
  },
  listItem: { paddingRight: 10 },
  repoName: { fontWeight: 'bold', marginLeft: 5 },
  description: { marginVertical: 10 },
  bottomTag: { flexDirection: 'row' },
  bottomTagText: { fontSize: 14, marginRight: 10, marginLeft: 3 },
  listContainer: {
    flex: 1,
  },
});

export default RepositoryListView;
