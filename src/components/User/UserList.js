import React, { PureComponent } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import {
  ListItem,
  List,
  Text,
  Left,
  Body,
  Right,
  Thumbnail,
  Row,
} from 'native-base';
import type { Node } from 'react';
import Container from 'SafeContainer';
import SwipeRow from 'SwipeRow';
import { getQuery } from './queries';
import { followUser, unfollowUser } from './mutations';
import { warpQueries } from 'utils';

type Props = {
  data: {
    loading: Boolean,
  },
  users: [Object],
  fetchMore: Node => null,
  refetch: Node => null,
  navigator: Object,
  userType: String,
};

/**
 * Display a List of Users
 * @extends PureComponent
 */
class UserList extends PureComponent<Props> {
  state = {
    refreshing: false,
  };

  /**
   * Open the User page to display information related to the specific user when
   * it is being pressed
   * @param  {String} username  "login" data for the user
   */
  handleClickUser = (username: String) => () =>
    this.props.navigator.push({
      screen: 'profile.user',
      title: username,
      passProps: { login: username },
    });

  /**
   * Used in FlatList to make sure that each user has a distinct key
   * @param  {Object} user  object containing information for each user
   * @return {String}      a unique key used to identify each row in list
   */
  userKeyExtractor = user => user.node.id;

  /**
   * Renders the user object into a row in the list
   * @param  {Object} item the object containing information for each user
   * @return {Node}       a React Native Node that can be rendered into a row
   *                      in the list
   */
  renderUser = ({ item: { node } }) => (
    <SwipeRow
      icon={
        node.viewerIsFollowing
          ? {
              name: 'person-outline',
              text: 'Unfollow',
              color: 'firebrick',
            }
          : { name: 'person-add', text: 'Follow', color: 'goldenrod' }
      }
      onPressButton={(node.viewerIsFollowing ? unfollowUser : followUser)(
        node.login
      )}
    >
      <ListItem avatar onPress={this.handleClickUser(node.login)}>
        <Left>
          <Thumbnail source={{ uri: node.avatarUrl }} style={styles.avatar} />
        </Left>
        <Body>
          <Row>
            {!!node.name && <Text style={styles.nameText}>{node.name}</Text>}
            <Text style={styles.usernameText}>{node.login}</Text>
          </Row>
          <Text note numberOfLines={2} style={styles.bioText}>
            {node.bio}
          </Text>
        </Body>
        <Right />
      </ListItem>
    </SwipeRow>
  );

  render = () => (
    <Container>
      <List>
        <FlatList
          data={this.props.users}
          renderItem={this.renderUser}
          keyExtractor={this.userKeyExtractor}
          onEndReached={this.props.fetchMore(this)}
          onRefresh={this.props.refetch(this)}
          refreshing={this.state.refreshing}
        />
      </List>
    </Container>
  );
}

const styles = StyleSheet.create({
  bioText: {
    marginTop: 3,
  },
  avatar: {
    margin: 5,
  },
  nameText: {
    marginRight: 10,
  },
  usernameText: {
    color: 'gray',
  },
});

// Compose queires
export default warpQueries(getQuery, 'userType', 'users')(UserList)([
  'followers',
  'following',
]);
