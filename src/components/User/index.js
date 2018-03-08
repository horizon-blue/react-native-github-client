import React from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Right,
  Title
} from 'native-base';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
// types
import type { Node } from 'react';

const GET_BASIC_INFO = gql`
  query {
    viewer {
      login
      email
      bio
    }
  }
`;

export default (): Node => (
  <Query query={GET_BASIC_INFO}>
    {({ loading, data }) =>
      loading ? (
        <Text>Loading</Text>
      ) : (
        <Container>
          <Content>
            <Text style={styles.welcome}>Welcome to React Native!</Text>
            <Text style={styles.instructions}>
              {JSON.stringify(data, null, 4)}
            </Text>
          </Content>
        </Container>
      )
    }
  </Query>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});
