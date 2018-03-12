import React, { PureComponent } from 'react';
import { WebView as RNWebView } from 'react-native';
import type { Node } from 'react';

import { openURL } from 'utils';

type Props = {
  uri: String,
  navigator: Object,
};

/**
 * A WebView component that displays the given content and open the external
 * browswer if contents are not SSL protected
 * @extends PureComponent
 */
class WebView extends PureComponent<Props> {
  static navigatorStyle = {
    tabBarHidden: true,
  };

  /**
   * This function should be triggered when user navigates inside the webview,
   * and it decides whether the new uri is safe to render inside the app. If
   * not, it will open the uri external browswer
   * @param  {String} url the link that user tries to follow
   * @return {Boolean}    whether the link has already been handled
   */
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
