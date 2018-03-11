import { Linking } from 'react-native';

/**
 * Given a link, returns a function that, when triggered,
 * open the given prefix + link + suffix page
 * @param  {String} link   the link itself
 * @return {function}       a funcion, when triggered, open the specific url
 */
export const openURL = url => () =>
  Linking.openURL(url).catch(error => console.log(error));

/**
 * Given a link and a reference to navigator, push the webview on top of the
 * current screen stack
 * @param  {String} uri       the link to open
 * @param  {Object} navigator a reference to the navigator object
 * @return {funcion}           a function, when triggered, push the webview
 */
export const openWebView = (uri, navigator) => () =>
  navigator.push({
    screen: 'profile.webview',
    passProps: { uri },
  });
