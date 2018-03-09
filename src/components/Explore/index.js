import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, H1, View } from 'native-base';
// types
import type { Node } from 'react';

export default (): Node => (
  <Container>
    <Content>
      <View style={styles.centerContainer}>
        <H1>TODO</H1>
      </View>
    </Content>
  </Container>
);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
});
