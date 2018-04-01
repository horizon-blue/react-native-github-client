import React, { PureComponent } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { List, Text, ListItem, Row, Grid } from 'native-base';
import Octicons from 'react-native-vector-icons/Octicons';
import moment from 'moment';
import _ from 'lodash';
import { openWebView } from 'utils';

type Props = {
  navigator: Object,
  notifications: [Object],
  onLoadMore: null => null,
  onRefresh: null => null,
  refreshing: Boolean,
  message: ?String,
};

class NotificationView extends PureComponent<Props> {
  renderNotification = ({ item }) => {
    const textStyle = item.unread
      ? styles.unreadNotiication
      : styles.readNotification;
    return (
      <ListItem
        onPress={openWebView(item.subject.html_url, this.props.navigator)}
      >
        <Grid>
          <Row>
            <Octicons
              name={iconMap[item.subject.type] || 'issue-opened'}
              size={18}
              style={styles.icon}
            />
            <Text style={textStyle} numberOfLines={1}>
              {item.repository.full_name}
            </Text>
          </Row>
          <Row>
            <Text note style={[textStyle, styles.subjectText]}>
              {_.startCase(item.subject.type) + ': ' + item.subject.title}
            </Text>
          </Row>
          <Row>
            <Text note>{moment(item.updated_at).fromNow()}</Text>
          </Row>
        </Grid>
      </ListItem>
    );
  };

  notificationKeyExtractor = notification => notification.id;

  render = () => (
    <List style={styles.listContainer}>
      <FlatList
        data={this.props.notifications}
        keyExtractor={this.notificationKeyExtractor}
        ListEmptyComponent={<Text>{this.props.message || 'No Content'}</Text>}
        renderItem={this.renderNotification}
        onEndReached={this.props.onLoadMore}
        onRefresh={this.props.onRefresh}
        refreshing={this.props.refreshing}
      />
    </List>
  );
}

const iconMap = {
  Issue: 'issue-opened',
  RepositoryVulnerabilityAlert: 'alert',
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  icon: {
    marginRight: 5,
  },
  unreadNotiication: {
    fontWeight: 'bold',
  },
  readNotification: {
    color: 'grey',
  },
  subjectText: {
    marginVertical: 5,
  },
});

export default NotificationView;
