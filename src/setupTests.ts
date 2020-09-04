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
