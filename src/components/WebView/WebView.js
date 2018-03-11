import React from 'react';
import { WebView } from 'react-native';
import type { Node } from 'react';

type Props = {
  uri: String,
  navigator: Object,
};

export default ({ uri, navigator }: Props): Node => {
  navigator.setButtons({
    rightButtons: [
      {
        component: 'BrowserButton', // This line loads our component as a nav bar button item
        id: 'openBrowswer',
        passProps: { uri },
      },
    ],
  });

  return <WebView source={{ uri }} />;
};
