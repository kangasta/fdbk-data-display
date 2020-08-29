import '@testing-library/jest-dom/extend-expect';
import { enableFetchMocks } from 'jest-fetch-mock';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mediaQuery from 'css-mediaquery';

export const createMatchMedia = (width: any): any => {
  return (query: any) => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => undefined,
    removeListener: () => undefined,
  });
};

enableFetchMocks();

// Fail tests on any warning
// eslint-disable-next-line no-console
console.error = (message: string): void => {
  throw new Error(message);
};

beforeAll(() => {
  window.matchMedia = createMatchMedia(window.innerWidth);
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });
});

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

export const getKeyUpEvent = (value: string, key = 'Enter') => ({
  key,
  target: { value },
});
