import React from 'react';
import { WebView } from 'react-native';
import type { Node } from 'react';

export default ({ uri }: { uri: String }): Node => <WebView source={{ uri }} />;
