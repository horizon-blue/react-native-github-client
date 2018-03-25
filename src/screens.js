import { Navigation } from 'react-native-navigation';
import { ApolloProvider } from 'react-apollo';
import type { Node } from 'react';

import { User, UserList, Login } from './components/User';
import { Explorer, Search } from './components/Explore';
import { RepositoryList } from './components/Repository';
import { WebView, BrowserButton } from './components/WebView';

// register screens that does not need apollo client
export const registerScreens = () => {
  Navigation.registerComponent('profile.user.login', () => Login);
  // the button to be used in webview
  Navigation.registerComponent('BrowserButton', () => BrowserButton);
};

// register screens that need to use apollo client
export const registerGraphQLScreens = client => {
  /**
   * A helper function to register each screen and coonect it with graphql
   * client and graphql store (so that results can be retrieve and cache)
   * @param  {String} name      identifier of the screen, should be unique
   * @param  {Node} component   the component corresponds to the page
   */
  const registerPage = (name: String, component: Node) =>
    Navigation.registerComponent(
      name,
      () => component,
      client.store,
      ApolloProvider,
      {
        client,
      }
    );

  registerPage('profile.user', User);
  registerPage('profile.user.list', UserList);
  registerPage('explore', Explorer);
  registerPage('explore.search', Search);
  registerPage('profile.repository.list', RepositoryList);
  registerPage('profile.webview', WebView);
};
