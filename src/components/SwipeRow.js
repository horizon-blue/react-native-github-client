import React, { PureComponent } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { Icon, Button, Text } from 'native-base';
import Interactable from 'react-native-interactable';

import type { Node } from 'react';

type Props = {
  children: Node,
  onPressButton: null => null,
  damping: Number,
  tension: Number,
  icon: ?{ name: String, text: String },
};

class SwipeRow extends PureComponent<Props> {
  static defaultProps = {
    damping: 0.4,
    tension: 300,
  };

  _deltaX = new Animated.Value(0);

  componentWillMount = () => {
    Dimensions.addEventListener('change', this.handleUpdate);
  };

  componentWillUnmount = () => {
    Dimensions.removeEventListener('change', this.handleUpdate);
  };

  handleUpdate = () => this.forceUpdate();

  hideButton = () => {
    this.swipebar.snapTo({ index: 0 });
  };

  render = () => {
    const { width } = Dimensions.get('window');

    return (
      <View>
        {this.props.icon && (
          <Animated.View
            style={[
              styles.trashHolder,
              {
                backgroundColor: this.props.icon.color,
                left: width - 78,
                width: width,
                transform: [
                  {
                    translateX: this._deltaX.interpolate({
                      inputRange: [-78, 0],
                      outputRange: [0, 78],
                    }),
                  },
                ],
              },
            ]}
          >
            <Button
              transparent
              vertical
              onPress={this.props.onPressButton}
              style={styles.button}
            >
              <Icon style={styles.icon} name={this.props.icon.name} />
              <Text style={styles.text}>{this.props.icon.text}</Text>
            </Button>
          </Animated.View>
        )}

        <Interactable.View
          ref={swipebar => (this.swipebar = swipebar)}
          horizontalOnly={true}
          snapPoints={[
            {
              x: 0,
              damping: 1 - this.props.damping,
              tension: this.props.tension,
            },
            {
              x: -78,
              damping: 1 - this.props.damping,
              tension: this.props.tension,
            },
          ]}
          animatedValueX={this._deltaX}
          dragEnabled={!!this.props.icon}
        >
          {this.props.children}
        </Interactable.View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  trashHolder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 35,
    color: 'white',
  },
  button: {
    width: 78,
    paddingBottom: 10,
  },
  text: {
    color: 'white',
    fontSize: 14,
  },
});

export default SwipeRow;
