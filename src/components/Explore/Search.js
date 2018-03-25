import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Input, Item, View, List, Text, Tabs, Tab } from 'native-base';
import { Query } from 'react-apollo';

import { searchQuery } from './queries';
import SearchRepositoryList from './SearchRepositoryList';
import Container from './SafeContainer';

type Props = {
  navigator: Object,
};

class Search extends PureComponent<Props> {
  state = {};
  timer = null;

  componentWillUnmount = () => clearTimeout(this.timer);

  handleChangeQuery = text => {
    clearTimeout(this.timer);
    this.setState({ text });
    this.timer = setTimeout(this.updateQuery, 500);
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
      <Tabs locked>
        <Tab heading="Repository">
          <SearchRepositoryList
            query={this.state.query}
            navigator={this.props.navigator}
          />
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
