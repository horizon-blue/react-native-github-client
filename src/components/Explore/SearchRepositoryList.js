import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import RepositoryListView from '../Repository/RepositoryListView';
import { searchQuery } from './queries';

type Props = {
  query: String,
  navigator: Object,
};

class SearchRepositoryList extends PureComponent<Props> {
  renderSearchResult = ({ loading, data }) =>
    !loading && (
      <RepositoryListView
        repositories={data.search.edges}
        fetchMore={() => null}
        refetch={() => null}
        navigator={this.props.navigator}
      />
    );

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
