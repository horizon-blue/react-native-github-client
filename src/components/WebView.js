import React from 'react';
import { WebView } from 'react-native';

export default props => <WebView source={{ uri: props.uri }} />;
