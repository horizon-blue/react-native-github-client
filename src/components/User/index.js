import React, { PureComponent } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import {
  Container,
  Content,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Title,
  Col,
  Row,
  Grid
} from 'native-base';
import _ from 'lodash/fp';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';
import moment from 'moment';
// types
import type { Node } from 'react';

const { width } = Dimensions.get('window');

const GET_BASIC_INFO = gql`
  query {
    viewer {
      id
      login
      email
      bio
      name
      avatarUrl
      websiteUrl
      company
      createdAt
      location
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(affiliations: OWNER) {
        totalCount
      }
      starredRepositories {
        totalCount
      }
    }
  }
`;

// map graphql query item with iconname & labelname
const profileMap = {
  login: ['face', 'Username'],
  email: ['mail-outline', 'Email'],
  company: ['people-outline', 'Company'],
  location: ['my-location', 'Location'],
  websiteUrl: [
    'link',
    'Website',
    url => url.replace(/^http(s?):\/\/|\/$/gi, '')
  ],
  createdAt: ['date-range', 'Joined', date => moment(date).format('LL')]
};

type ListRowProps = {
  text: String | Number,
  iconName: String,
  labelName: String
};
const ListRow = ({ text, iconName, labelName, ...props }: ListRowProps) => (
  <ListItem icon {...props}>
    <Left>
      <MaterialIcons name={iconName} size={25} />
    </Left>
    <Body>
      <Text>{labelName}</Text>
    </Body>
    <Right style={styles.listContent}>
      <Text numberOfLines={1}>{text}</Text>
    </Right>
  </ListItem>
);

type Props = {
  data: {
    loading: Boolean,
    viewer: Object
  }
};

@graphql(GET_BASIC_INFO)
class Profile extends PureComponent<Props> {
  renderProfileList = viewer =>
    _.flow(
      _.entries,
      _.map(
        ([queryItem, [iconName, labelName, callback]]) =>
          viewer[queryItem] ? (
            <ListRow
              key={queryItem}
              text={callback ? callback(viewer[queryItem]) : viewer[queryItem]}
              iconName={iconName}
              labelName={labelName}
            />
          ) : null
      )
    )(profileMap);

  render = (): Node => {
    const { data: { loading, viewer, error } } = this.props;
    return loading ? (
      <Text>Loading</Text>
    ) : error ? (
      <Text>Connection error</Text>
    ) : (
      <Container>
        <Content>
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
            <ListItem>
              <Body style={{ flex: 3 }}>
                <Grid>
                  <Col>
                    <TouchableOpacity style={styles.centerContainer}>
                      <Row>
                        <Text>Followers</Text>
                      </Row>
                      <Row>
                        <Text note>{viewer.followers.totalCount}</Text>
                      </Row>
                    </TouchableOpacity>
                  </Col>
                  <Col>
                    <TouchableOpacity style={styles.centerContainer}>
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
            <ListItem itemDivider />

            {this.renderProfileList(viewer)}
            <ListItem itemDivider />
            <ListRow
              iconName="star"
              labelName="Starred Repositories"
              text={viewer.starredRepositories.totalCount}
            />
            <ListRow
              iconName="device-hub"
              labelName="Owned Repositories"
              text={viewer.repositories.totalCount}
            />
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
    alignItems: 'center'
  },
  avatar: {
    marginBottom: 10
  },
  bio: {
    color: 'darkgray'
  },
  listContent: {
    maxWidth: width * 0.6
  }
});

export default Profile;
