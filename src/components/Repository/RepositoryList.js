import React, { PureComponent } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Text, List, ListItem, Grid, Row, View } from 'native-base';
import Octicons from 'react-native-vector-icons/Octicons';
import Container from '../SafeContainer';

import { getQuery } from './queries';
import { warpQueries, openWebView } from 'utils';

type Props = {
  data: {
    loading: Boolean,
  },
  repositories: [Object],
  fetchMore: null => null,
  navigator: Object,
  repoType: String,
  login: ?String,
};

class RepositoryList extends PureComponent<Props> {
  repoKeyExtractor = repo => repo.node.id;

  renderRepo = ({ item: { node } }) => (
    <View style={node.isPrivate ? styles.privateRepo : null}>
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
                <Text style={styles.bottomTagText}>{node.forkCount}</Text>
              </View>
            )}
          </Row>
        </Grid>
      </ListItem>
    </View>
  );

  render = () => (
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
