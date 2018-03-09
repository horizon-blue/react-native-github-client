import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { ListItem, Left, Body, Right, Text } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Props = {
  text: String | Number,
  iconName: String,
  labelName: String
};
export default ({ text, iconName, labelName, ...props }: Props) => (
  <ListItem icon {...props}>
    <Left>
      <MaterialIcons name={iconName} size={25} />
    </Left>
    <Body>
      <Text>{labelName}</Text>
    </Body>
    <Right style={styles.listContent}>
      <Text numberOfLines={1}>{text}</Text>
    </Right>
  </ListItem>
);

const { width } = Dimensions.get('window');

const styles: Object = StyleSheet.create({
  listContent: {
    maxWidth: width * 0.6
  }
});
