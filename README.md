# fdbk-data-display

[![Build Status](https://travis-ci.org/kangasta/fdbk-data-display.svg?branch=master)](https://travis-ci.org/kangasta/fdbk-data-display)
[![Maintainability](https://api.codeclimate.com/v1/badges/599a9467889aabe7ccd2/maintainability)](https://codeclimate.com/github/kangasta/fdbk-data-display/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/599a9467889aabe7ccd2/test_coverage)](https://codeclimate.com/github/kangasta/fdbk-data-display/test_coverage)

React app to display data provided by an API in [fdbk](https://github.com/kangasta/fdbk.git) statistics format. See `fdbk/examples/net_status` for an example.

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
# Build
npm run build

# Build with non-root public URL
echo 'PUBLIC_URL="/${path}/#/"' > .env
npm run build -- --public-url /${path}/
```

### Interface Types

The fdbk interfaces are defined by JSONSchema documents in [fdbk](https://github.com/kangasta/fdbk.git) repository and converted to TypeScript definitions with [json-schema-to-typescript](https://www.npmjs.com/package/json-schema-to-typescript). For example to create statistics types, cd into fdbk repository root and run:

```bash
json2ts fdbk/schemas/statistics-out.json > Statistics.ts
```

Replace the file in [src/Types](./src/Types) with produced file.
