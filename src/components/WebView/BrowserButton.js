import React from 'react';
import { TouchableOpacity } from 'react-native';
import { openURL } from 'utils';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  uri: String,
};

/**
 * The Button that appears on the top right corner of the WebView page, such
 * that, when being pressed, open the uri in external browser
 * @param  {String} uri the link to open when being pressed down
 */
export default ({ uri }: Props) => (
  <TouchableOpacity onPress={openURL(uri)}>
    <Ionicons name="ios-compass-outline" color="#157EFB" size={25} />
  </TouchableOpacity>
);
