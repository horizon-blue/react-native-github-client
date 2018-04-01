import React, { PureComponent } from 'react';
import _ from 'lodash';
import NotificationView from './NotificationView';
import Container from 'SafeContainer';
import { getNotification } from './queries';
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
  };

  componentDidMount = () => {
    this.fetchNotification();
    addLogoutListener('refreshNotification', this.handleRefresh);
  };

  componentWillUnmount = () => {
    removeLogoutListener('refreshNotification');
  };

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
          notifications: _.unionBy(
            refresh ? [] : this.state.notifications,
            res.data,
            notification => notification.id
          ),
          refreshing: false,
        });
      })
      .catch(err => {
        this.loading = false;
        this.setState({ error: err.message, refreshing: false });
      });
  };

  handleRefresh = () => this.fetchNotification(true);
  handleLoadMore = () => this.fetchNotification(false);

  render = () => (
    <Container>
      <NotificationView
        navigator={this.props.navigator}
        notifications={this.state.notifications}
        error={this.state.error}
        onLoadMore={this.handleLoadMore}
        onRefresh={this.handleRefresh}
        refreshing={this.state.refreshing}
      />
    </Container>
  );
}

export default Notification;
