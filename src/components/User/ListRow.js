import React, { PureComponent } from 'react';
import { Dimensions } from 'react-native';
import { ListItem, Left, Body, Right, Text } from 'native-base';
import Octicons from 'react-native-vector-icons/Octicons';

type Props = {
  text: String | Number,
  iconName: String,
  labelName: String,
};

/**
 * The component used to display the content of each row in user's profile page
 */
class ListRow extends PureComponent<Props> {
  componentDidMount = () => {
    Dimensions.addEventListener('change', this.handleUpdate);
  };

  componentWillUnmount = () => {
    Dimensions.removeEventListener('change', this.handleUpdate);
  };

  handleUpdate = () => this.forceUpdate();

  render = () => {
    const { text, iconName, labelName, ...props } = this.props;
    const { width } = Dimensions.get('window');
    return (
      <ListItem icon {...props}>
        <Left>
          <Octicons name={iconName} size={25} />
        </Left>
        <Body>
          <Text>{labelName}</Text>
        </Body>
        <Right style={{ maxWidth: width * 0.6 }}>
          <Text numberOfLines={1}>{text}</Text>
        </Right>
      </ListItem>
    );
  };
}

export default ListRow;
