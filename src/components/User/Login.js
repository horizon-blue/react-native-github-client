import React, { PureComponent } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import Container from 'SafeContainer';

type Props = {
  onSubmit: null => null,
};

class Login extends PureComponent<Props> {
  /**
   * Auto focus next field (password) when pressing the return key on username
   * field
   */
  handlePressNext = () => this.password._root.focus();

  handleSubmit = () => this.props.onSubmit('asdf');

  render = () => (
    <Container>
      <Content>
        <Form>
          <Item floatingLabel>
            <Label>Username</Label>
            <Input
              autoCapitalize="none"
              returnKeyType="next"
              autoCorrect={false}
              onSubmitEditing={this.handlePressNext}
              autoFocus
            />
          </Item>
          <Item floatingLabel last>
            <Label>Password</Label>
            <Input
              secureTextEntry
              returnKeyType="send"
              getRef={password => (this.password = password)}
            />
          </Item>
          <Button block onPress={this.handleSubmit} style={styles.button}>
            <Text>Submit</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  button: {
    marginTop: height * 0.1,
    marginHorizontal: 10,
  },
});

export default Login;
