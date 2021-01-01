import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { createMatchMedia } from '../setupTests';
import { getKeyUpEvent } from '../Utils/testUtils';

import { App } from '../App';

const TEST_API_URL = 'http://api_test_url/';
const TEST_TOPIC_NAME = 'Google';
const TEST_TOPIC_ID = '9fb87c42-6d2b-4932-bb1a-088fdd4e9c1a';
const TEST_DATA_URL = `${TEST_API_URL}topics/${TEST_TOPIC_ID}/data`;

/* eslint-disable @typescript-eslint/no-var-requires */
const TOPICS_JSON = require('./topics.json');
const TOPIC_DATA_JSON = require('./topic_data.json');
const UNKNOWN_DATA_JSON = require('./unknown_data.json');
/* eslint-enable @typescript-eslint/no-var-requires */

jest.mock('chart.js');

const getResponse = (data: any, status = 200) =>
  Promise.resolve(
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  );

const getInvalidResponse = () =>
  getResponse({ message: 'Test invalid response.' });
const getFetchResponse = (url: any) => {
  if (url === `${TEST_API_URL}topics`) {
    return getResponse(TOPICS_JSON);
  } else if ((url as string).startsWith(TEST_DATA_URL)) {
    return getResponse(TOPIC_DATA_JSON);
  }

  return getResponse(UNKNOWN_DATA_JSON, 404);
};

const changeInputValue = async (
  label: string,
  value: string
): Promise<void> => {
  const field = await screen.findByLabelText(label);
  await fireEvent.keyUp(field, getKeyUpEvent(value));
};

it('renders without crashing', (): void => {
  render(<App />);
});

it('has darkmode toggle', async (): Promise<void> => {
  const { findByTestId } = render(<App />);
  const darkmodeToggle = await findByTestId('darkmode-toggle-button');

  expect(document.body).toHaveStyle('background-color: #fafafa');

  fireEvent.click(darkmodeToggle);
  expect(document.body).toHaveStyle('background-color: #303030');

  fireEvent.click(darkmodeToggle);
  expect(document.body).toHaveStyle('background-color: #fafafa');
});

it('shows getting started page when API URL is not configured', async (): Promise<void> => {
  const { findByText } = render(<App />);
  await findByText('Getting started');
});

it('allows configuring API URL and shows error message on invalid response from API', async (): Promise<void> => {
  const fetchSpy = jest
    .spyOn(window, 'fetch')
    .mockImplementation(getInvalidResponse);
  const { findByTestId } = render(<App />);

  const settingsToggle = await findByTestId('settings-view-toggle-button');
  await fireEvent.click(settingsToggle);

  await changeInputValue('Statistics URL', TEST_API_URL);
  await fireEvent.click(await screen.findByLabelText('Display query bar'));
  await fireEvent.click(settingsToggle);

  const errorContainer = await findByTestId('error-container');
  expect(errorContainer.textContent).toContain(
    'No statistics data in the response'
  );
  expect(fetchSpy).toHaveBeenCalledWith(
    `${TEST_API_URL}overview`,
    expect.anything()
  );
});

it('allows setting page title in settings', async (): Promise<void> => {
  const testTitle = 'TEST_TITLE';
  const { container, findByTestId, findByText } = render(<App />);
  expect(container.textContent).not.toContain(testTitle);

  const settingsToggle = await findByTestId('settings-view-toggle-button');
  await fireEvent.click(settingsToggle);
  await changeInputValue('Page title', testTitle);

  await fireEvent.click(settingsToggle);
  const title = await findByText(testTitle);
  expect(title.tagName).toEqual('H1');

  await fireEvent.click(settingsToggle);
  await changeInputValue('Page title', '');
  expect(container.textContent).not.toContain(testTitle);
});

it('hides menu items in speed dial on small screens', async (): Promise<void> => {
  window.matchMedia = createMatchMedia(500);
  const { findByTestId } = render(<App />);

  const settingsToggle = await findByTestId('settings-view-toggle-button');
  expect(settingsToggle).toHaveClass('MuiSpeedDialAction-fabClosed');

  const menuToggle = await findByTestId('menu-toggle-button');
  await fireEvent.click(menuToggle);
  expect(settingsToggle).not.toHaveClass('MuiSpeedDialAction-fabClosed');

  await fireEvent.click(menuToggle);
  expect(settingsToggle).toHaveClass('MuiSpeedDialAction-fabClosed');
});

const openTopicsView = async (linkText = TEST_TOPIC_NAME): Promise<void> => {
  let sideDrawerToggle = screen.queryByTitle('Open side drawer');

  const settingsToggle = await screen.findByTestId(
    'settings-view-toggle-button'
  );
  await fireEvent.click(settingsToggle);

  if (!sideDrawerToggle) {
    const fullApiToggle = await screen.findByLabelText(
      'Statistics URL implements full fdbk API'
    );
    await fireEvent.click(fullApiToggle);
  }
  await changeInputValue('Statistics URL', TEST_API_URL);

  sideDrawerToggle = await screen.findByTitle('Open side drawer');
  await fireEvent.click(sideDrawerToggle);

  const linkToTestTopic = await screen.findByText(linkText);
  await fireEvent.click(linkToTestTopic);
  await screen.findByText('Topics list');
};

it('displays side drawer and topics view if fullApi setting is enabled', async (): Promise<void> => {
  const fetchSpy = jest
    .spyOn(window, 'fetch')
    .mockImplementation(getFetchResponse);

  window.history.pushState(null, 'title', `http://localhost/`);
  const { findByTestId, findByText } = render(<App />);

  await openTopicsView();

  expect(fetchSpy).toHaveBeenCalledWith(
    `${TEST_API_URL}topics`,
    expect.anything()
  );

  const testTopicAccordion = await findByTestId(
    `topics-accordion-summary-${TEST_TOPIC_ID}`
  );
  expect(testTopicAccordion).toHaveClass('Mui-expanded');

  const topicsBreadcrumb = await findByText('Topics');
  await fireEvent.click(topicsBreadcrumb);

  expect(testTopicAccordion).not.toHaveClass('Mui-expanded');

  await fireEvent.click(testTopicAccordion);
  expect(testTopicAccordion).toHaveClass('Mui-expanded');

  await fireEvent.click(testTopicAccordion);
  expect(testTopicAccordion).not.toHaveClass('Mui-expanded');
});

it('displays error message if trying to get data of unknown topic', async (): Promise<void> => {
  jest.spyOn(window, 'fetch').mockImplementation(getFetchResponse);

  const path = 'topics/unknown/data';
  window.history.pushState(null, 'title', `http://localhost/${path}`);
  const { findByTestId } = render(<App />);

  const errorContainer = await findByTestId('error-container');
  expect(errorContainer.textContent).toContain(UNKNOWN_DATA_JSON.error);
});

it('displays topic data if fullApi setting is enabled', async (): Promise<void> => {
  const fetchSpy = jest
    .spyOn(window, 'fetch')
    .mockImplementation(getFetchResponse);

  window.history.pushState(null, 'title', `http://localhost/`);
  const { findByTestId, findAllByTitle } = render(<App />);

  await openTopicsView();

  const dataLink = await findAllByTitle('Show data');
  await fireEvent.click(dataLink[1]);

  const { elapsed, timestamp } = TOPIC_DATA_JSON[0];
  const dataAccordion = await findByTestId(
    `data-accordion-summary-${timestamp}`
  );
  await fireEvent.click(dataAccordion);
  expect(dataAccordion.parentElement?.textContent).toContain(`${elapsed} ms`);

  expect(fetchSpy).toHaveBeenCalledWith(
    expect.stringContaining(TEST_DATA_URL),
    expect.anything()
  );
});
