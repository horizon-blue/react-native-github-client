import React, { PureComponent } from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { List, Text, ListItem, Left, Body, Thumbnail } from 'native-base';
import moment from 'moment';
import Container from 'SafeContainer';
import { AsyncStorage } from 'react-native';
import { getEvent } from './queries';
import { addLogoutListener, removeLogoutListener } from '../../auth';
import { openWebView } from 'utils';

type Props = {
  navigator: Object,
};

/**
 * An explorer to navigate other github content
 */
class Explorer extends PureComponent<Props> {
  page = 1;

  state = {
    events: [],
    refreshing: false,
  };
  componentDidMount = () => {
    AsyncStorage.getItem('events')
      .then(events => this.setState({ events: JSON.parse(events) || [] }))
      .then(() => this.fetchEvent(true))
      .catch(err => console.log(err));
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    addLogoutListener('refreshExplore', this.handleRefresh);
  };

  componentWillUnmount = () => {
    removeLogoutListener('refreshExplore');
  };

  handlePressUser = (login: String) => () =>
    this.props.navigator.push({
      screen: 'profile.user',
      title: login,
      passProps: { login },
    });

  onNavigatorEvent = ({ type, id }) => {
    if (type === 'NavBarButtonPress' && id === 'search') {
      this.props.navigator.push({
        screen: 'explore.search',
        title: 'Search',
      });
    }
  };

  handleRefresh = () => this.fetchEvent(true);
  handleLoadMore = () => this.fetchEvent(false);

  fetchEvent = (refresh = false) => {
    if (this.loading || this.state.refreshing) return;
    this.loading = true;

    const page = refresh ? 1 : this.page;
    if (refresh) this.setState({ refreshing: true });

    getEvent(page)
      .then(res => {
        this.loading = false;
        this.page = page + 1;
        this.setState(
          {
            events: (refresh ? [] : this.state.events).concat(res.data),
            refreshing: false,
          },
          this.storeEvents
        );
      })
      .catch(err => {
        this.loading = false;
        this.setState({ error: err.message, refreshing: false });
      });
  };

  storeEvents = () =>
    AsyncStorage.setItem('events', JSON.stringify(this.state.events)).catch(
      err => console.log(err)
    );

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

  render = () => {
    const { error, events } = this.state;

    return events.length === 0 ? (
      error ? (
        <Text>{error}</Text>
      ) : (
        <Text>Loading...</Text>
      )
    ) : (
      <Container>
        <List>
          <FlatList
            data={this.state.events}
            keyExtractor={this.eventKeyExtractor}
            renderItem={this.renderEvent}
            onEndReached={this.handleLoadMore}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
          />
        </List>
      </Container>
    );
  };
}

const styles = StyleSheet.create({
  avatar: {
    margin: 5,
  },
  listitem: {
    paddingVertical: 5,
  },
});

export default Explorer;
