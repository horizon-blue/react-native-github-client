import { Navigation } from 'react-native-navigation';

import { User, UserList } from './components/User';
import Explore from './components/Explore';
import { RepositoryList } from './components/Repository';
import { WebView, BrowserButton } from './components/WebView';

// register all screens of the app (including internal ones)
export default (store, Provider, client) => {
  const registerPage = (name, component) =>
    Navigation.registerComponent(name, () => component, store, Provider, {
      client,
    });

  registerPage('profile.user', User);
  registerPage('profile.user.list', UserList);
  registerPage('explore', Explore);
  registerPage('profile.repository.list', RepositoryList);
  registerPage('profile.webview', WebView);

  Navigation.registerComponent('BrowserButton', () => BrowserButton);
};
