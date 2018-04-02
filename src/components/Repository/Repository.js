import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import {
  Text,
  Content,
  Button,
  List,
  ListItem,
  Grid,
  Row,
  Col,
  View,
} from 'native-base';
import { graphql, Mutation } from 'react-apollo';
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryLabel,
} from 'victory-native';
import Octicons from 'react-native-vector-icons/Octicons';
import { getRepository, getCommitActivity } from './queries';
import Container from 'SafeContainer';
import { openWebView } from 'utils';
import { addStar, removeStar } from './mutations';

type Props = {
  data: {
    loading: Boolean,
    error: ?String,
    repository: ?Object,
  },
  owner: String,
  name: String,
  navigator: Object,
};

@graphql(getRepository, {
  options: props => ({
    variables: {
      owner: props.owner,
      name: props.name,
    },
  }),
})
class Repository extends PureComponent<Props> {
  state = {};

  componentDidMount = () => {
    this.handleGetCommitActivity();
  };

  componentWillUnmount = () => {
    clearTimeout(this.commitActivityTimer);
  };

  handleGetCommitActivity = () =>
    getCommitActivity(this.props.owner, this.props.name)
      .then(
        res =>
          res.status === 202
            ? (this.commitActivityTimer = setTimeout(
                this.handleGetCommitActivity,
                1000
              ))
            : this.setState({
                commitActivity: res.data.map((value, idx) => ({
                  x: idx + 1,
                  y: value.total,
                })),
              })
      )
      .catch(err => console.log(err.message));

  renderCommitActivity = () => {
    if (!this.state.commitActivity) return null;
    return (
      <ListItem>
        <VictoryChart theme={VictoryTheme.material}>
          <VictoryLabel x={25} y={24} text="Number of Commits Over Weeks" />
          <VictoryLine
            style={{
              data: { stroke: '#1780FB' },
              parent: { border: '1px solid #ccc' },
            }}
            data={this.state.commitActivity}
          />
        </VictoryChart>
      </ListItem>
    );
  };

  render = () => {
    const { loading, error, repository } = this.props.data;

    return loading ? (
      <Text>Loading...</Text>
    ) : error ? (
      <Text>{error}</Text>
    ) : (
      <Container>
        <Content>
          <List>
            <ListItem>
              <Grid>
                <Row>
                  <Octicons name="repo" size={18} />
                  <Text style={styles.repoName} numberOfLines={1}>
                    {repository.nameWithOwner}
                  </Text>
                </Row>
                <Row>
                  <Text style={styles.description}>
                    {repository.description || 'No description'}
                  </Text>
                </Row>
                <Row>
                  {!!repository.primaryLanguage && (
                    <View style={styles.bottomTag}>
                      <Octicons
                        size={15}
                        name="primitive-dot"
                        color={repository.primaryLanguage.color}
                      />
                      <Text style={styles.bottomTagText}>
                        {repository.primaryLanguage.name}
                      </Text>
                    </View>
                  )}
                  {!!repository.stargazers.totalCount && (
                    <View style={styles.bottomTag}>
                      <Octicons size={15} name="star" />
                      <Text style={styles.bottomTagText}>
                        {repository.stargazers.totalCount}
                      </Text>
                    </View>
                  )}
                  {!!repository.forkCount && (
                    <View style={styles.bottomTag}>
                      <Octicons size={15} name="repo-forked" />
                      <Text style={styles.bottomTagText}>
                        {repository.forkCount}
                      </Text>
                    </View>
                  )}
                </Row>
              </Grid>
            </ListItem>
            {this.renderCommitActivity()}
            <Grid>
              <Row style={styles.buttonBottom}>
                <Col style={styles.buttonLeft}>
                  <Button
                    full
                    transparent
                    onPress={openWebView(repository.url, this.props.navigator)}
                  >
                    <Text>Open Repository Page</Text>
                  </Button>
                </Col>
                <Col>
                  <Mutation mutation={addStar}>
                    {addStar => (
                      <Mutation mutation={removeStar}>
                        {removeStar =>
                          repository.viewerHasStarred ? (
                            <Button
                              full
                              danger
                              transparent
                              onPress={() =>
                                removeStar({
                                  variables: { starrableId: repository.id },
                                })
                              }
                            >
                              <Text>Unstar</Text>
                            </Button>
                          ) : (
                            <Button
                              full
                              transparent
                              onPress={() =>
                                addStar({
                                  variables: { starrableId: repository.id },
                                })
                              }
                            >
                              <Text>Star</Text>
                            </Button>
                          )
                        }
                      </Mutation>
                    )}
                  </Mutation>
                </Col>
              </Row>
            </Grid>
          </List>
        </Content>
      </Container>
    );
  };
}

const styles = StyleSheet.create({
  repoName: { fontWeight: 'bold', marginLeft: 5 },
  description: { marginVertical: 10, color: 'grey' },
  buttonLeft: { borderRightWidth: 1, borderRightColor: '#E0E0E0' },
  buttonBottom: { borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  bottomTag: { flexDirection: 'row' },
  bottomTagText: { fontSize: 14, marginRight: 10, marginLeft: 3 },
});

export default Repository;
