import React from 'react';
import RepositoryListView from './RepositoryListView';
import { getQuery } from './queries';
import { warpQueries } from 'utils';

import Container from 'SafeContainer';

// Compose queires
const RepositoryWithQuery = warpQueries(getQuery, 'repoType', 'repositories')(
  RepositoryListView
)([['repositories', 'affiliations: OWNER'], 'starredRepositories', 'watching']);

export default props => (
  <Container>
    <RepositoryWithQuery {...props} searchEnabled />
  </Container>
);
