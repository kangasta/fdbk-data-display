import '@testing-library/jest-dom/extend-expect';

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
