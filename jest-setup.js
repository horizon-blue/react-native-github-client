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

module.exports = SafariView;
