import React, { PureComponent } from 'react';
import { Text, Content } from 'native-base';
import { graphql } from 'react-apollo';
import { getRepository } from './queries';
import Container from 'SafeContainer';

@graphql(getRepository, {
  options: props => ({
    variables: {
      owner: props.owner,
      name: props.name,
    },
  }),
})
class Repository extends PureComponent {
  render = () => (
    <Container>
      <Content>
        <Text>{JSON.stringify(this.props, null, 4)}</Text>
      </Content>
    </Container>
  );
}

export default Repository;
