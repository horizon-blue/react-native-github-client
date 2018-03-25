import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import {
  Content,
  Text,
  List,
  ListItem,
  Body,
  Thumbnail,
  Title,
  Col,
  Row,
  Grid,
  Button,
} from 'native-base';
import _ from 'lodash/fp';
import moment from 'moment';
// types
import type { Node } from 'react';
import Container from 'SafeContainer';
import { openURL, warpQueries, openWebView } from 'utils';
import { getUserQuery } from './queries';
import { followUser, unfollowUser } from './mutations';
import ListRow from './ListRow';

// map graphql query item with iconname & labelname
const profileMap = {
  login: ['octoface', 'Username'],
  email: ['mail', 'Email', null, email => openURL('mailto:' + email)],
  company: ['organization', 'Company'],
  location: ['location', 'Location'],
  websiteUrl: [
    'link',
    'Website',
    url => url.replace(/^http(s?):\/\/|\/$/gi, ''),
    openWebView,
  ],
  createdAt: [
    'calendar',
    'Joined',
    date => moment(date).format('LL'),
    null,
    { last: true },
  ],
};

type Props = {
  data: {
    loading: Boolean,
    user: ?Object,
  },
  navigator: Object,
  viewer: Object,
  login: ?String,
  logout: null => null,
  refetch: Node => null,
};

/**
 * The User Profile page
 * @extends PureComponent
 */
class User extends PureComponent<Props> {
  state = {
    refreshing: false,
  };
  /**
   * the function map the list of information avaliable for the user to
   * a list of React component. If any of the information is missing, it
   * returns null for the specific item
   * @param  {Object} viewer the object containing information on the viewer
   * @return {[Node]}        an array of React Native Nodes
   */
  renderProfileList = viewer =>
    _.flow(
      _.entries,
      _.map(
        ([queryItem, [iconName, labelName, callback, onPressFunc, props]]) =>
          viewer[queryItem] ? (
            <ListRow
              key={queryItem}
              text={callback ? callback(viewer[queryItem]) : viewer[queryItem]}
              iconName={iconName}
              labelName={labelName}
              onPress={onPressFunc ? onPressFunc(viewer[queryItem]) : null}
              {...props}
            />
          ) : null
      )
    )(profileMap);

  /**
   * Navigate to the UserList page that displays a list of users that follow the
   * current user
   */
  handlePressFollower = () =>
    this.props.navigator.push({
      screen: 'profile.user.list',
      title: 'Followers',
      passProps: { userType: 'followers', login: this.props.login },
    });

  /**
   * Navigate to the UserList page that displays a list of users that current
   * user follows
   */
  handlePressFollowing = () =>
    this.props.navigator.push({
      screen: 'profile.user.list',
      title: 'Following',
      passProps: { userType: 'following', login: this.props.login },
    });

  /**
   * Navigate to the RepoList page that displays a list of repositories that
   * the current user stars
   */
  handlePressStarRepo = () =>
    this.props.navigator.push({
      screen: 'profile.repository.list',
      title: 'Starred Repositories',
      passProps: { repoType: 'starredRepositories', login: this.props.login },
    });

  /**
   * Navigate to the RepoList page that displays a list of repositories that
   * the current user creates and owned
   */
  handlePressOwnRepo = () =>
    this.props.navigator.push({
      screen: 'profile.repository.list',
      title: 'Owned Repositories',
      passProps: { repoType: 'repositories', login: this.props.login },
    });

  render = (): Node => {
    const { data: { loading, error }, viewer } = this.props;

    // log the error, if any
    error && console.error(error);

    // render the main content if and only if the data were successfully loaded
    return loading ? (
      <Text>Loading</Text>
    ) : error ? (
      <Text>Connection error</Text>
    ) : (
      <Container>
        <Content
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.props.refetch(this)}
            />
          }
        >
          <List>
            <ListItem noBorder>
              <Body style={styles.centerContainer}>
                <Thumbnail
                  large
                  source={{ uri: viewer.avatarUrl }}
                  style={styles.avatar}
                />
                <Title>{viewer.name}</Title>
                <Text style={styles.bio}>{viewer.bio}</Text>
              </Body>
            </ListItem>
            <ListItem last>
              <Body style={{ flex: 3 }}>
                <Grid>
                  <Col>
                    <TouchableOpacity
                      style={styles.centerContainer}
                      onPress={this.handlePressFollower}
                    >
                      <Row>
                        <Text>Followers</Text>
                      </Row>
                      <Row>
                        <Text note>{viewer.followers.totalCount}</Text>
                      </Row>
                    </TouchableOpacity>
                  </Col>
                  <Col>
                    <TouchableOpacity
                      style={styles.centerContainer}
                      onPress={this.handlePressFollowing}
                    >
                      <Row>
                        <Text>Following</Text>
                      </Row>
                      <Row>
                        <Text note>{viewer.following.totalCount}</Text>
                      </Row>
                    </TouchableOpacity>
                  </Col>
                </Grid>
              </Body>
            </ListItem>
            <ListItem itemDivider bordered />

            {this.renderProfileList(viewer)}
            <ListItem itemDivider bordered />
            <ListRow
              iconName="star"
              labelName="Starred Repositories"
              text={viewer.starredRepositories.totalCount}
              onPress={this.handlePressStarRepo}
            />
            <ListRow
              iconName="repo"
              labelName="Owned Repositories"
              text={viewer.repositories.totalCount}
              onPress={this.handlePressOwnRepo}
              last={true}
            />

            {viewer.isViewer ? (
              this.props.logout ? (
                <Button full transparent danger onPress={this.props.logout}>
                  <Text>Logout</Text>
                </Button>
              ) : null
            ) : viewer.viewerIsFollowing ? (
              <Button
                full
                transparent
                danger
                onPress={unfollowUser(viewer.login)}
              >
                <Text>Unfollow</Text>
              </Button>
            ) : (
              <Button full transparent onPress={followUser(viewer.login)}>
                <Text>Follow</Text>
              </Button>
            )}
          </List>
        </Content>
      </Container>
    );
  };
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 10,
  },
  bio: {
    color: 'darkgray',
  },
});

// Compose queires
export default warpQueries(getUserQuery)(User)([null]);
