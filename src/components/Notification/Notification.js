import React, { PureComponent } from 'react';
import _ from 'lodash/fp';
import NotificationView from './NotificationView';
import Container from 'SafeContainer';
import { getNotification, getSingleNotification } from './queries';
import { markAsRead } from './mutations';
import { addLogoutListener, removeLogoutListener } from '../../auth';

type Props = {
  navigator: Object,
};

type State = {
  notifications: [Object],
};

class Notification extends PureComponent<Props, State> {
  page = 1;

  state = {
    notifications: [],
    refreshing: false,
    message: 'Loading...',
  };

  componentDidMount = () => {
    this.fetchNotification();
    addLogoutListener('refreshNotification', this.handleRefresh);
  };

  componentWillUnmount = () => {
    removeLogoutListener('refreshNotification');
  };

  handleMarkAsRead = id => () =>
    markAsRead(id)
      .then(() => getSingleNotification(id))
      .then(res => res.data)
      .then(notification =>
        this.setState({
          notifications: _.map(item => (item.id === id ? notification : item))(
            this.state.notifications
          ),
        })
      )
      .catch(err => console.warn(err));

  fetchNotification = (refresh = false) => {
    if (this.loading || this.state.refreshing) return;
    this.loading = true;
    const page = refresh ? 1 : this.page;
    if (refresh) this.setState({ refreshing: true });

    return getNotification(page)
      .then(res => {
        this.loading = false;
        this.page = page + 1;
        this.setState({
          notifications: _.unionBy(notification => notification.id)(
            refresh ? [] : this.state.notifications
          )(res.data),
          message: null,
          refreshing: false,
        });
      })
      .catch(err => {
        this.loading = false;
        this.setState({ message: err.message, refreshing: false });
      });
  };

  handleRefresh = () => this.fetchNotification(true);
  handleLoadMore = () => this.fetchNotification(false);

  render = () => (
    <Container>
      <NotificationView
        navigator={this.props.navigator}
        notifications={this.state.notifications}
        message={this.state.message}
        onLoadMore={this.handleLoadMore}
        onRefresh={this.handleRefresh}
        refreshing={this.state.refreshing}
        onMarkAsRead={this.handleMarkAsRead}
      />
    </Container>
  );
}

export default Notification;
