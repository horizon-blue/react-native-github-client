import React, { PureComponent } from 'react';
import { Text } from 'native-base';
import { AsyncStorage } from 'react-native';
import { getEvent } from './queries';
import { addLogoutListener, removeLogoutListener } from '../../auth';
import ExplorerView from './ExplorerView';
import _ from 'lodash';

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
      .then(events =>
        this.setState({ events: events ? JSON.parse(events) : [] }, () =>
          this.fetchEvent(true)
        )
      )
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

    return getEvent(page)
      .then(res => {
        this.loading = false;
        this.page = page + 1;
        this.setState(
          {
            events: _.unionBy(
              refresh ? [] : this.state.events,
              res.data,
              event => event.id
            ),
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

  render = () => {
    const { error, events, refreshing } = this.state;

    return events.length === 0 ? (
      error ? (
        <Text>{error}</Text>
      ) : (
        <Text>Loading...</Text>
      )
    ) : (
      <ExplorerView
        navigator={this.props.navigator}
        events={events}
        onLoadMore={this.handleLoadMore}
        onRefresh={this.handleRefresh}
        refreshing={refreshing}
      />
    );
  };
}

export default Explorer;
