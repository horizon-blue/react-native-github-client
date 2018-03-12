import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { ListItem, Left, Body, Right, Text } from 'native-base';
import Octicons from 'react-native-vector-icons/Octicons';

type Props = {
  text: String | Number,
  iconName: String,
  labelName: String,
};

/**
 * The component used to display the content of each row in user's profile page
 * @param  {String} text      the main content to display
 * @param  {String} iconName  the name of icon (should be one of the Octicons)
 * @param  {String} labelName the text to be displayed for the label
 * @param  {Object} props     other props that will be apply to the outer
 *                            container
 */
export default ({ text, iconName, labelName, ...props }: Props) => (
  <ListItem icon {...props}>
    <Left>
      <Octicons name={iconName} size={25} />
    </Left>
    <Body>
      <Text>{labelName}</Text>
    </Body>
    <Right style={styles.listContent}>
      <Text numberOfLines={1}>{text}</Text>
    </Right>
  </ListItem>
);

// widht of the content should be adaptive
const { width } = Dimensions.get('window');

const styles: Object = StyleSheet.create({
  listContent: {
    maxWidth: width * 0.6,
  },
});
