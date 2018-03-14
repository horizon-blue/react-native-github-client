import { graphql } from 'react-apollo';
import _ from 'lodash/fp';

import { deepMerge } from 'utils';

/**
 * A helper function that generate a function to transform fetched result
 * to props
 * @param  {String} propName    the prop name to transformed
 * @param  {String} ownPropName the prop to receive data
 * @param  {Boolean} isViewer    whether the current query is for viewer
 * @return {function}           a function that transformed
 */
const transformProps = (ownPropName, propName, isViewer) => ({
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
    fetchMore: component => () => {
      // prevent repeatively fetching the same content
      if (component.isFetchingMore) return;
      component.isFetchingMore = true;
      fetchMore({
        variables: {
          before: _.first(props.edges).cursor,
          login: ownProps.login,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          component.isFetchingMore = false;
          return deepMerge(fetchMoreResult, previousResult);
        },
      });
    },
    data: rest,
  };
};

/**
 * A helper function that return a warpper function that can be applied to
 * a component so that it select the query based on props[ownPropName] and
 * match the selected result to props[propName]. The returned function, when
 * evaluate on a component, should return a function that takes a list of
 * arguments to be passed in to queryGetter for each query
 * @param  {function} queryGetter the function that should return a graphql
 * @param  {String} ownPropName the prop name to transformed
 * @param  {String} propName    the prop to receive data
 *                              query when evaluated
 * @return {function}           a function in arity of two
 */
export default (queryGetter, ownPropName, propName) =>
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
