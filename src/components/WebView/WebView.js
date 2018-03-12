import React, { PureComponent } from 'react';
import { WebView as RNWebView } from 'react-native';
import type { Node } from 'react';

import { openURL } from 'utils';

type Props = {
  uri: String,
  navigator: Object,
};

class WebView extends PureComponent<Props> {
  static navigatorStyle = {
    tabBarHidden: true,
  };

  handlePageChange = ({ url }) => {
    if (/^https:\/\//i.test(url)) {
      this.props.navigator.setButtons({
        rightButtons: [
          {
            component: 'BrowserButton', // This line loads our component as a nav bar button item
            id: 'openBrowswer',
            passProps: { uri: url },
          },
        ],
      });
      return true;
    } else {
      openURL(url)();
      return false;
    }
  };

  render = (): Node => {
    const { uri } = this.props;

    return (
      <RNWebView
        source={{ uri }}
        onShouldStartLoadWithRequest={this.handlePageChange}
      />
    );
  };
}

export default WebView;
