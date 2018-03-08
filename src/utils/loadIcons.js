import _ from 'lodash';
import Feather from 'react-native-vector-icons/Feather';

const SIZE = 28;
const COLOR = 'blue';

export default (icons: Array) =>
  Promise.all(
    _.map(icons, name => Feather.getImageSource(name, SIZE, COLOR))
  ).then(resources => {
    return _.chain(icons)
      .map((name: String, index: Number) => [name, resources[index]])
      .fromPairs()
      .value();
  });
