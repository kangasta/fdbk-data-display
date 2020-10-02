import React from 'react';

import { Typography } from '@material-ui/core';

import { Page } from '../Utils/Page';
import { DemoCharts, DemoList, DemoTable } from '../Utils/Demo';

export const GettingStarted = (): React.ReactElement => (
  <Page>
    <Typography variant="h5" component="h2">
      Getting started
    </Typography>
    <p>
      Hello!{' '}
      <span role="img" aria-label="waving hand">
        👋
      </span>
    </p>
    <p>
      You are seeing this demo page because this data display has not been
      configured to fetch data from any API. In order to configure API and
      authentication for this data display, navigate to the settings page.
      Alternatively, if you are the admin of this page, you can configure the
      default settings through a <code>config.js</code> file. This{' '}
      <code>config.js</code> file should be located in the same directory as the{' '}
      <code>index.html</code>.
    </p>
    <p>If you are here to see the demo charts, kick back and relax.</p>
    <DemoCharts />
    <DemoList />
    <DemoTable />
  </Page>
);
