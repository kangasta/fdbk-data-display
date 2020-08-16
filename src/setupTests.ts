import '@testing-library/jest-dom/extend-expect';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

// Fail tests on any warning
// eslint-disable-next-line no-console
console.error = (message: string): void => {
  throw new Error(message);
};

// Clear mocks for each test
beforeEach(() => {
  jest.restoreAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  window.localStorage.clear();
});

export const TEST_ID_NAME = 'Test Dude';
export const TEST_ID_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZ2l2ZW5fbmFtZSI6IlRlc3QiLCJmYW1pbHlfbmFtZSI6IkR1ZGUiLCJpYXQiOjE1MTYyMzkwMjJ9.SRHYhnDAuP2qB1dHTo4-aCS8gO5nTpzZKEIKXdtMVdQ';
