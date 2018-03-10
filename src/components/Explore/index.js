import React from 'react';
import { StyleSheet } from 'react-native';
import { Content, H1, View } from 'native-base';
import type { Node } from 'react';
import Container from '../SafeContainer';

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
