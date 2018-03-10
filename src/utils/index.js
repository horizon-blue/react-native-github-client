import { Linking } from 'react-native';
import { graphql } from 'react-apollo';
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
 * @param  {String} ownPropName the prop to receive data
 * @param  {Boolean} isViewer    whether the current query is for viewer
 * @return {function}           a function that transformed
 */
export const transformProps = (ownPropName, propName, isViewer) => ({
  ownProps,
  data: { viewer, user, fetchMore, ...rest },
}) => {
  if (rest.loading || rest.error)
    return {
      data: rest,
      fetchMore: () => {},
    };
  const actor = isViewer ? viewer : user;

  if (!ownPropName)
    return {
      data: rest,
      viewer: actor,
    };

  const props = actor[ownProps[ownPropName]];

  return {
    [propName]: _.reverse(props.edges),
    fetchMore: () =>
      fetchMore({
        variables: {
          before: _.first(props.edges).cursor,
          login: ownProps.login,
        },
        updateQuery: (previousResult, { fetchMoreResult }) =>
          deepMerge(fetchMoreResult, previousResult),
      }),
    data: rest,
  };
};

/**
 * A helper function that return a warpper function that can be applied to
 * a component so that it select the query based on props[ownPropName] and
 * match the selected result to props[propName]. The returned function, when
 * evaluate on a component, should return a function that takes a list of
 * arguments to be passed in to queryGetter for each query
 * @param  {String} ownPropName the prop name to transformed
 * @param  {String} propName    the prop to receive data
 * @param  {function} queryGetter the function that should return a graphql
 *                              query when evaluated
 * @return {function}           a function in arity of two
 */
export const warpQueries = (ownPropName, propName, queryGetter) =>
  _.reduce((result, args) => {
    const [field, rest] = _.isArray(args) ? args : [args, null];
    return graphql(queryGetter(field, rest, false), {
      skip: props =>
        (ownPropName && props[ownPropName] !== field) || !props.login,
      options: ({ login }) => ({ variables: { login } }),
      props: transformProps(ownPropName, propName, false),
    })(
      graphql(queryGetter(field, rest, true), {
        skip: props =>
          (ownPropName && props[ownPropName] !== field) || props.login,
        props: transformProps(ownPropName, propName, true),
      })(result)
    );
  });
