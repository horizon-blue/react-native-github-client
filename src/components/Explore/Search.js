import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import {
  Container,
  Input,
  Item,
  View,
  List,
  Text,
  Tabs,
  Tab,
} from 'native-base';
import { Query } from 'react-apollo';

import { searchQuery } from './queries';

class Search extends PureComponent {
  state = {};
  timer = null;

  handleChangeQuery = text => {
    clearTimeout(this.timer);
    this.setState({ text });
    this.timer = setTimeout(this.updateQuery, 1000);
  };

  updateQuery = () => this.setState({ query: this.state.text });

  renderSearchResult = ({ data }) => (
    <List>
      <Text>{JSON.stringify(data, null, 4)}</Text>
    </List>
  );

  render = () => (
    <Container>
      <View style={styles.searchContainer}>
        <Item rounded>
          <Input
            autoFocus
            onChangeText={this.handleChangeQuery}
            value={this.state.text}
            autoCapitalize="none"
          />
        </Item>
      </View>
      <Tabs>
        <Tab heading="Repository">
          <Query
            query={searchQuery}
            variables={{ query: this.state.query, type: 'REPOSITORY' }}
          >
            {this.renderSearchResult}
          </Query>
        </Tab>
        <Tab heading="User">
          <Query
            query={searchQuery}
            variables={{ query: this.state.query, type: 'USER' }}
          >
            {this.renderSearchResult}
          </Query>
        </Tab>
      </Tabs>
    </Container>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    padding: 10,
    backgroundColor: '#F8F8F8',
  },
});

export default Search;
