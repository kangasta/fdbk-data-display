# fdbk-data-display

[![Build Status](https://travis-ci.org/kangasta/fdbk-data-display.svg?branch=master)](https://travis-ci.org/kangasta/fdbk-data-display)
[![Maintainability](https://api.codeclimate.com/v1/badges/599a9467889aabe7ccd2/maintainability)](https://codeclimate.com/github/kangasta/fdbk-data-display/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/599a9467889aabe7ccd2/test_coverage)](https://codeclimate.com/github/kangasta/fdbk-data-display/test_coverage)

Demo project for a blog post.

## Development

### Getting stared

To get development server running on your machine, run:

```bash
# Install dependencies and start dev server
npm install
npm start
```

### Before committing

The code is linted and unit tested with:

```bash
# Lint
npm run lint
# or
npm run lint -- --fix
# to also fix automatically fixable errors

# Unit test
npm test
# or
npm test -- --coverage
# to also get coverage analysis
```

To create production build:

```bash
npm run build
```