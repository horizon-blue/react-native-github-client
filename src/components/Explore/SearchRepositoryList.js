import React, { PureComponent } from 'react';
import { Text } from 'native-base';
import { Query } from 'react-apollo';
import RepositoryListView from '../Repository/RepositoryListView';
import { searchQuery } from './queries';

type Props = {
  query: String,
  navigator: Object,
};

class SearchRepositoryList extends PureComponent<Props> {
  handleRefetch = refetch => listview => () => {
    if (listview.state.refreshing) return;
    listview.setState({ refreshing: true });
    refetch().then(listview.setState({ refreshing: false }));
  };

  renderSearchResult = ({ loading, error, data }) => {
    return !this.props.query ? null : loading ? (
      <Text>Loading...</Text>
    ) : error ? (
      <Text>{error}</Text>
    ) : (
      <RepositoryListView
        repositories={data.search.edges}
        fetchMore={() => null}
        refetch={this.handleRefetch}
        navigator={this.props.navigator}
      />
    );
  };

  render = () => (
    <Query
      query={searchQuery}
      variables={{ query: this.props.query, type: 'REPOSITORY' }}
      skip={!this.props.query}
    >
      {this.renderSearchResult}
    </Query>
  );
}

export default SearchRepositoryList;
