import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import { Container, ListItem, List, Text } from 'native-base';

import { getQuery } from './queries';
import { warpQueries } from 'Profile/src/utils';

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
  userKeyExtractor = user => user.node.id;

  renderUser = ({ item: { node } }) => (
    <ListItem>
      <Text>{JSON.stringify(node, null, 4)}</Text>
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

// Compose queires
export default warpQueries('userType', 'users', getQuery)(UserList)([
  'followers',
  'following',
]);
