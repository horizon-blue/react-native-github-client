import { Linking } from 'react-native';
import _ from 'lodash/fp';

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

/**
 * A helper function that recursively merge two objects without mutation
 * @param  {Object} objA the desination object
 * @param  {Object} objB the source object
 * @return {Object}      the merged object
 */
export const deepMerge = (objA, objB) =>
  _.assignWith((aVal, bVal) => {
    if (_.isArray(aVal)) return aVal.concat(bVal);
    if (_.isObject(aVal) && _.isObject(bVal)) return deepMerge(aVal, bVal);
    return bVal;
  })(objA)(objB);

/**
 * A helper function that generate a function to transform fetched result
 * to props
 * @param  {String} propName    the prop name to transformed
 * @param  {String} ownPropName the prop to
 * @return {function}           a function that transformed
 */
export const transformProps = (ownPropName, propName) => ({
  ownProps,
  data: { viewer, fetchMore, ...rest },
}) => {
  if (rest.loading || rest.error)
    return {
      data: rest,
      fetchMore: () => {},
    };

  const props = viewer[ownProps[ownPropName]];

  return {
    [propName]: _.reverse(props.edges),
    fetchMore: () =>
      fetchMore({
        variables: { before: _.first(props.edges).cursor },
        updateQuery: (previousResult, { fetchMoreResult }) =>
          deepMerge(fetchMoreResult, previousResult),
      }),
    data: rest,
  };
};
