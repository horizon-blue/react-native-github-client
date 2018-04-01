import React, { PureComponent } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { List, Text } from 'native-base';

type Props = {
  navigator: Object,
  notifications: [Object],
  onLoadMore: null => null,
  onRefresh: null => null,
  refreshing: Boolean,
  error: ?String,
};

class NotificationView extends PureComponent<Props> {
  renderNotification = ({ item }) => (
    <Text>{JSON.stringify(item, null, 4)}</Text>
  );

  notificationKeyExtractor = notification => notification.id;

  render = () => (
    <List style={styles.listContainer}>
      <FlatList
        data={this.props.notifications}
        keyExtractor={this.notificationKeyExtractor}
        ListEmptyComponent={<Text>{this.props.error || 'No Content'}</Text>}
        renderItem={this.renderNotification}
        onEndReached={this.props.onLoadMore}
        onRefresh={this.props.onRefresh}
        refreshing={this.props.refreshing}
      />
    </List>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
});

export default NotificationView;
