import React, { PureComponent } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
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
  Title
} from 'native-base';
import _ from 'lodash';
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
      repositories {
        totalCount
      }
      starredRepositories {
        totalCount
      }
    }
  }
`;

type Props = {
  data: {
    loading: Boolean,
    viewer: Object
  }
};

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
const ListRow = ({ text, iconName, labelName }: ListRowProps): Node => (
  <ListItem icon>
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

@graphql(GET_BASIC_INFO)
class Profile extends PureComponent<Props> {
  renderProfileList = viewer =>
    _.map(
      profileMap,
      ([iconName, labelName, callback], queryItem) =>
        viewer[queryItem] ? (
          <ListRow
            key={queryItem}
            text={callback ? callback(viewer[queryItem]) : viewer[queryItem]}
            iconName={iconName}
            labelName={labelName}
          />
        ) : null
    );

  render = (): Node => {
    const { data: { loading, viewer } } = this.props;
    return loading ? (
      <Text>Loading</Text>
    ) : (
      <Container>
        <Content>
          <List>
            <ListItem noBorder>
              <Body style={styles.avatarContainer}>
                <Thumbnail
                  large
                  source={{ uri: viewer.avatarUrl }}
                  style={styles.avatar}
                />
                <Title>{viewer.name}</Title>
                <Text style={styles.bio}>{viewer.bio}</Text>
              </Body>
            </ListItem>
            {this.renderProfileList(viewer)}
            <ListItem itemDivider />
            <ListRow
              iconName="star"
              labelName="Starred Repositories"
              text={viewer.starredRepositories.totalCount}
            />
            <ListItem>
              <Text>{JSON.stringify(viewer, null, 4)}</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  };
}

const styles = StyleSheet.create({
  avatarContainer: {
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
