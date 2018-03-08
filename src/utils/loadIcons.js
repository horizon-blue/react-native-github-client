import _ from 'lodash/fp';
import Feather from 'react-native-vector-icons/Feather';

const SIZE = 28;
const COLOR = 'blue';

export default (icons: Array) =>
  Promise.all(
    _.map((name: String) => Feather.getImageSource(name, SIZE, COLOR))(icons)
  ).then(resources => _.zipObject(icons)(resources));
