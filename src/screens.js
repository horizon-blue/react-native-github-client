import { Navigation } from 'react-native-navigation';
import type { Node } from 'react';

import { User, UserList } from './components/User';
import Explore from './components/Explore';
import { RepositoryList } from './components/Repository';
import { WebView, BrowserButton } from './components/WebView';

// register all screens of the app (including internal ones)
export default (store, Provider, client) => {
  /**
   * A helper function to register each screen and coonect it with graphql
   * client and graphql store (so that results can be retrieve and cache)
   * @param  {String} name      identifier of the screen, should be unique
   * @param  {Node} component   the component corresponds to the page
   */
  const registerPage = (name: String, component: Node) =>
    Navigation.registerComponent(name, () => component, store, Provider, {
      client,
    });

  registerPage('profile.user', User);
  registerPage('profile.user.list', UserList);
  registerPage('explore', Explore);
  registerPage('profile.repository.list', RepositoryList);
  registerPage('profile.webview', WebView);

  // the button to be used in webview
  Navigation.registerComponent('BrowserButton', () => BrowserButton);
};
