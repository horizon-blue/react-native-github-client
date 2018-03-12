import { YellowBox } from 'react-native';

/**
 * Because React deprecates some lifecycle method in newest release, but
 * React Native hasn't been keeping up yet, some of the components (e.g. View,
 * Text) still use the deprecated method, and will trigger the warning. This
 * is pretty annoying when developing the program, especially since the number
 * of warning goes up as more components are used. So a current workaround is
 * to disable those warnings. See the following link for details:
 * https://github.com/facebook/react-native/issues/18175#issuecomment-370575211
 */
export default () => {
  YellowBox.ignoreWarnings([
    'Warning: componentWillMount is deprecated',
    'Warning: componentWillReceiveProps is deprecated',
  ]);
};
