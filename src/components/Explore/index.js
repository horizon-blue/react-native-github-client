import React, { PureComponent } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { List, Text, ListItem, Left, Body, Thumbnail } from 'native-base';
import moment from 'moment';
import Container from 'SafeContainer';
import { getEvent } from './queries';
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
  };
  componentDidMount = () => this.fetchEvent();

  fetchEvent = () => {
    if (this.loading) return;
    this.loading = true;

    getEvent(this.page)
      .then(res => {
        this.loading = false;
        this.page = this.page + 1;
        this.setState({ events: this.state.events.concat(res.data) });
      })
      .catch(err => {
        this.loading = false;
        this.setState({ error: err.message });
      });
  };

  renderEvent = ({ item }) => {
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
            <Left>
              <Thumbnail
                small
                source={{ uri: item.actor.avatar_url }}
                style={styles.avatar}
              />
            </Left>
            <Body>
              <Text>
                {item.actor.login} starred {item.repo.name}
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
            onEndReached={this.fetchEvent}
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
