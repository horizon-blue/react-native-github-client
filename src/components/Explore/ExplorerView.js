import React, { PureComponent } from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { List, Text, ListItem, Left, Body, Thumbnail } from 'native-base';
import moment from 'moment';
import Container from 'SafeContainer';
import { openWebView } from 'utils';

type Props = {
  navigator: Object,
  events: [Object],
  onLoadMore: null => null,
  onRefresh: null => null,
  refreshing: Boolean,
};

/**
 * An explorer to navigate other github content
 */
class ExplorerView extends PureComponent<Props> {
  handlePressUser = (login: String) => () =>
    this.props.navigator.push({
      screen: 'profile.user',
      title: login,
      passProps: { login },
    });

  renderEvent = ({ item }) => {
    const avatar = (
      <TouchableOpacity onPress={this.handlePressUser(item.actor.login)}>
        <Thumbnail
          small
          source={{ uri: item.actor.avatar_url }}
          style={styles.avatar}
        />
      </TouchableOpacity>
    );

    switch (item.type) {
      case 'WatchEvent':
        return (
          <ListItem
            avatar
            style={styles.listitem}
            onPress={openWebView(
              item.repo.url.replace('api.github.com/repos', 'github.com'),
              this.props.navigator
            )}
          >
            <Left>{avatar}</Left>
            <Body>
              <Text>
                {item.actor.login} starred {item.repo.name}
              </Text>
              <Text note>{moment(item.created_at).fromNow()}</Text>
            </Body>
          </ListItem>
        );
      case 'ForkEvent':
        return (
          <ListItem
            avatar
            style={styles.listitem}
            onPress={openWebView(
              item.payload.forkee.url.replace(
                'api.github.com/repos',
                'github.com'
              ),
              this.props.navigator
            )}
          >
            <Left>{avatar}</Left>
            <Body>
              <Text>
                {item.actor.login} forked {item.payload.forkee.name} from{' '}
                {item.repo.name}
              </Text>
              <Text note>{moment(item.created_at).fromNow()}</Text>
            </Body>
          </ListItem>
        );
      case 'CreateEvent':
        return (
          <ListItem
            avatar
            style={styles.listitem}
            onPress={openWebView(
              item.repo.url.replace('api.github.com/repos', 'github.com'),
              this.props.navigator
            )}
          >
            <Left>{avatar}</Left>
            <Body>
              <Text>
                {item.actor.login} created a repository {item.repo.name}
              </Text>
              <Text note>{moment(item.created_at).fromNow()}</Text>
            </Body>
          </ListItem>
        );
      case 'PushEvent':
        return (
          <ListItem
            avatar
            style={styles.listitem}
            onPress={openWebView(
              item.repo.url.replace('api.github.com/repos', 'github.com') +
                '/commit/' +
                item.payload.head,
              this.props.navigator
            )}
          >
            <Left>{avatar}</Left>
            <Body>
              <Text>
                {item.actor.login} pushed to {item.repo.name}
              </Text>
              <Text note>{moment(item.created_at).fromNow()}</Text>
            </Body>
          </ListItem>
        );
    }
  };

  eventKeyExtractor = event => event.id;

  render = () => (
    <Container>
      <List>
        <FlatList
          data={this.props.events}
          keyExtractor={this.eventKeyExtractor}
          renderItem={this.renderEvent}
          onEndReached={this.props.onLoadMore}
          onRefresh={this.props.onRefresh}
          refreshing={this.props.refreshing}
        />
      </List>
    </Container>
  );
}

const styles = StyleSheet.create({
  avatar: {
    margin: 5,
  },
  listitem: {
    paddingVertical: 5,
  },
});

export default ExplorerView;
