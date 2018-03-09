import { Linking } from 'react-native';

/**
 * Given a link, returns a function that, when triggered,
 * open the given prefix + link + suffix page
 * @param  {String} link   the link itself
 * @return {function}        [description]
 */
export const openURL = url => () =>
  Linking.openURL(url).catch(error => console.log(error));
