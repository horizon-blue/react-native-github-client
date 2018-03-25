import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Input, Item, View, List, Text } from 'native-base';
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
        <Query
          query={searchQuery}
          variables={{ query: this.state.query, type: 'REPOSITORY' }}
        >
          {this.renderSearchResult}
        </Query>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    margin: 10,
  },
});

export default Search;
