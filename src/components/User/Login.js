import React, { PureComponent } from 'react';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import { Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import Container from 'SafeContainer';
import { login } from 'utils';

type Props = {
  onSubmit: null => null,
};

class Login extends PureComponent<Props> {
  state = {};

  /**
   * Auto focus next field (password) when pressing the return key on username
   * field
   */
  handlePressNext = () => this.password._root.focus();

  handleChangeUsername = username =>
    this.setState({ username, nameError: false });
  handleChangePassword = password =>
    this.setState({ password, pwdError: false });
  handleSubmit = () => {
    login(this.state.username, this.state.password)
      .then(this.props.onSubmit)
      .catch(err => {
        Alert.alert('Login Failed', err.message);
        this.setState({ nameError: true, pwdError: true });
      });
  };

  render = () => (
    <Container>
      <Content>
        <Form>
          <Item floatingLabel error={this.state.nameError}>
            <Label>Username</Label>
            <Input
              autoCapitalize="none"
              returnKeyType="next"
              autoCorrect={false}
              onSubmitEditing={this.handlePressNext}
              autoFocus
              value={this.state.username}
              onChangeText={this.handleChangeUsername}
            />
          </Item>
          <Item floatingLabel error={this.state.pwdError}>
            <Label>Password</Label>
            <Input
              secureTextEntry
              returnKeyType="send"
              getRef={password => (this.password = password)}
              value={this.state.password}
              onChangeText={this.handleChangePassword}
              onSubmitEditing={this.handleSubmit}
            />
          </Item>
          <Button block onPress={this.handleSubmit} style={styles.button}>
            <Text>Login</Text>
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
