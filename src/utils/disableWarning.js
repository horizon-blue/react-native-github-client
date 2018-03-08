import { YellowBox } from 'react-native';

export default () => {
  YellowBox.ignoreWarnings([
    'Warning: componentWillMount is deprecated',
    'Warning: componentWillReceiveProps is deprecated'
  ]);
};
