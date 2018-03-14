import React from 'react';
import { Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import Container from 'SafeContainer';

export default props => (
  <Container>
    <Content>
      <Form>
        <Item floatingLabel>
          <Label>Username</Label>
          <Input />
        </Item>
        <Item floatingLabel last>
          <Label>Password</Label>
          <Input secureTextEntry={true} />
        </Item>
        <Button onPress={props.onSubmit}>
          <Text>Submit</Text>
        </Button>
      </Form>
    </Content>
  </Container>
);
