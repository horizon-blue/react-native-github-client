/* global jest */
import SafariView from 'react-native-safari-view';

// fix jest warning. Reference:
// https://github.com/facebook/jest/issues/2208

jest.mock('react-native-safari-view', () => {
  return {
    show: jest.fn(),
    dismiss: jest.fn(),
    isAvailable: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
});

Date.now = jest.fn(() => new Date(Date.UTC(2017, 1, 1)).valueOf());

module.exports = SafariView;
