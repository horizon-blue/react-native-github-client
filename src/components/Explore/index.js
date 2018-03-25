import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Content, Text, View } from 'native-base';
import Container from 'SafeContainer';
import { getEvent } from './queries';

type Props = {};

/**
 * An explorer to navigate other github content
 */
class Explorer extends PureComponent<Props> {
  page = 1;

  state = {
    events: [],
  };
  componentDidMount = () => this.fetchEvent();

  fetchEvent = () => {
    if (this.loading) return;
    this.loading = true;

    getEvent(this.page)
      .then(res => {
        this.loading = false;
        this.page = this.page + 1;
        this.setState({ events: this.state.events.concat(res.data) });
      })
      .catch(err => {
        this.loading = false;
        this.setState({ error: err.message });
      });
  };
  render = () => {
    const { error, events } = this.state;

    return events.length === 0 ? (
      error ? (
        <Text>{error}</Text>
      ) : (
        <Text>Loading...</Text>
      )
    ) : (
      <Container>
        <Content>
          <View style={styles.centerContainer}>
            <Text>{JSON.stringify(events, null, 4)}</Text>
          </View>
        </Content>
      </Container>
    );
  };
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default Explorer;
