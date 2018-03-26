import 'react-native';
import React from 'react';
import Explorer from '../src/components/Explore/Explorer';
import ExplorerView from '../src/components/Explore/ExplorerView';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

const navigator = {
  setOnNavigatorEvent: jest.fn(),
};

it('explorer renders correctly', () => {
  expect(
    renderer.create(<Explorer navigator={navigator} />).toJSON()
  ).toMatchSnapshot();
});

it('explorer list display events', () => {
  const events = [
    {
      id: '123456',
      type: 'CreateEvent',
      actor: {
        login: 'foo',
        avatar_url: '',
      },
      repo: {
        name: 'foo/bar',
        url: '',
      },
      created_at: '2018-03-26T04:06:30Z',
    },
    {
      id: '2345678',
      type: 'WatchEvent',
      actor: {
        login: 'segmentation',
        avatar_url: '',
      },
      repo: {
        name: 'asdf',
        url: '',
      },
      created_at: '2018-03-26T02:48:28Z',
    },
    {
      id: '12987423',
      type: 'ForkEvent',
      actor: {
        login: 'foo',
        avatar_url: '',
      },
      payload: {
        forkee: {
          url: '',
          name: 'asdf',
        },
      },
      repo: {
        name: 'asdf',
      },
      created_at: '2018-03-26T02:48:28Z',
    },
    {
      id: '230405',
      type: 'PushEvent',
      actor: {
        login: 'foo',
        avatar_url: '',
      },
      payload: {
        head: '1a2b3c',
      },
      repo: {
        name: 'asdf',
        url: '',
      },
      created_at: '2018-03-26T02:48:28Z',
    },
  ];

  expect(
    renderer
      .create(<ExplorerView navigator={navigator} events={events} />)
      .toJSON()
  ).toMatchSnapshot();
});
