import React from 'react';
import { SafeAreaView } from 'react-native';
import { Container } from 'native-base';
import type { Node } from 'react';

/**
 * A React Component that warp the children of Container into
 * a SafeAreaView so that the contents can be displayed properly
 * in every kinds of view (including iphone X)
 */
export default ({ children, ...props }: { children: Node }) => (
  <Container {...props}>
    <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
  </Container>
);
