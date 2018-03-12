import React from 'react';
import { SafeAreaView } from 'react-native';
import { Container } from 'native-base';
import type { Node } from 'react';

/**
 * A React Component that warp the children of Container into
 * a SafeAreaView so that the contents can be displayed properly
 * in every kinds of view (including iphone X), by automatically inserting
 * paddings inside the SafeAreaView
 * @param  {Node}   children React components to be render inside of the view
 * @param  {Object} props    Other props, this will be directly apply to the
 *                          outer Container
 */
export default ({ children, ...props }: { children: Node }) => (
  <Container {...props}>
    <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
  </Container>
);
