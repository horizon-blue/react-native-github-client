import React from 'react';
import { TouchableOpacity } from 'react-native';
import { openURL } from 'utils';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  uri: String,
};

export default ({ uri }: Props) => (
  <TouchableOpacity onPress={openURL(uri)}>
    <Ionicons name="ios-compass-outline" color="#157EFB" size={25} />
  </TouchableOpacity>
);
