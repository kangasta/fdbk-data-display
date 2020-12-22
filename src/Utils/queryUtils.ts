import { FromNow, QueryState } from '../Reducers/query';

const DAY = 3600 * 24 * 1000;

export type QueryObject = {
  [key: string]: string | number | boolean | undefined;
};
export const objToQueryString = (obj: QueryObject): string => {
  return Object.keys(obj)
    .filter((key) => Boolean(obj[key]))
    .map((key) => `${key}=${encodeURI(String(obj[key]))}`)
    .join('&');
};

const getIsoString = (millis: number) => new Date(millis).toISOString();

const getFromNowQuery = (fromNow?: FromNow): string => {
  switch (fromNow) {
    default:
    case 'Last 12 hours':
      return objToQueryString({ since: getIsoString(Date.now() - 0.5 * DAY) });
    case 'Last day':
      return objToQueryString({ since: getIsoString(Date.now() - DAY) });
    case 'Last 3 days':
      return objToQueryString({ since: getIsoString(Date.now() - 3 * DAY) });
    case 'Last 7 days':
      return objToQueryString({ since: getIsoString(Date.now() - 7 * DAY) });
  }
};

const getMonthQuery = (year: number, month: number): string =>
  objToQueryString({
    since: getIsoString(Number(new Date(year, month - 1))),
    until: getIsoString(Number(new Date(year, month))),
  });

export const queryStateToQueryString = ({
  mode,
  queryString,
  fromNow,
  year,
  month,
}: QueryState): string => {
  switch (mode) {
    case 'From now':
      return getFromNowQuery(fromNow);
    case 'Month':
      return getMonthQuery(year, month);
    case 'Query string':
      return queryString || '';
    default:
      return '';
  }
};

const addQueryString = (url: string, queryString: string) => {
  if (!queryString) {
    return url;
  }
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${queryString}`;
};

export const withQueryString = (
  url: string,
  query: QueryState,
  otherParameters: QueryObject = {}
) => {
  let queryString = queryStateToQueryString(query);
  let newUrl = addQueryString(url, queryString);

  queryString = objToQueryString(otherParameters);
  newUrl = addQueryString(newUrl, queryString);
  return newUrl;
};

export const joinPaths = (a: string, b: string): string => {
  return `${a.replace(/\/+$/, '')}/${b.replace(/^\/+/, '')}`;
};
