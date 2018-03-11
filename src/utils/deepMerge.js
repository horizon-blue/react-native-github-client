import _ from 'lodash/fp';

/**
 * A helper function that recursively merge two objects without mutation
 * @param  {Object} objA the desination object
 * @param  {Object} objB the source object
 * @return {Object}      the merged object
 */
const deepMerge = (objA, objB) =>
  _.assignWith((aVal, bVal) => {
    if (_.isArray(aVal)) return aVal.concat(bVal);
    if (_.isObject(aVal) && _.isObject(bVal)) return deepMerge(aVal, bVal);
    return bVal;
  })(objA)(objB);

export default deepMerge;
