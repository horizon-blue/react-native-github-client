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
import Container from 'SafeContainer';
import { getQuery } from './queries';
import { warpQueries } from 'utils';

type Props = {
  data: {
    loading: Boolean,
  },
  users: [Object],
  fetchMore: null => null,
  navigator: Object,
  userType: String,
};

class UserList extends PureComponent<Props> {
  handleClickUser = (username: String) => () =>
    this.props.navigator.push({
      screen: 'profile.user',
      title: username,
      passProps: { login: username },
    });

  userKeyExtractor = user => user.node.id;

  renderUser = ({ item: { node } }) => (
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
  );
  render = () => (
    <Container>
      <List>
        <FlatList
          data={this.props.users}
          renderItem={this.renderUser}
          keyExtractor={this.userKeyExtractor}
          onEndReached={this.props.fetchMore}
          onEndReachedThreshold={0.01}
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
