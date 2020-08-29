import { queryReducer, QueryState, FromNow } from '../../Reducers/query';
import { clearQuery } from '../../Utils/actionCreators';
import { objToQueryString, withQueryString } from '../../Utils/queryUtils';

const DEFAULT_QUERY = queryReducer(undefined, clearQuery());
const getQuery = (query: Partial<QueryState>): QueryState => ({
  ...DEFAULT_QUERY,
  ...query,
});

const DAY = 3600 * 24 * 1000;
const URL = 'http://test';

describe('objToQueryString', (): void => {
  it('transforms object into query string', (): void => {
    const obj = {
      string: 'asd',
      number: 123,
      boolean: true,
      undefined: undefined,
    };
    const queryString = objToQueryString(obj);
    expect(queryString).toEqual('string=asd&number=123&boolean=true');
  });
});

describe('withQueryString', (): void => {
  it('adds from now query parameters to url', () => {
    const now = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(now);
    [
      { fromNow: 'Last 12 hours', millis: 0.5 * DAY },
      { fromNow: 'Last day', millis: 1 * DAY },
      { fromNow: 'Last 3 days', millis: 3 * DAY },
      { fromNow: 'Last 7 days', millis: 7 * DAY },
    ].forEach(({ fromNow, millis }) => {
      expect(
        withQueryString(URL, getQuery({ fromNow: fromNow as FromNow }))
      ).toEqual(`${URL}?since=${new Date(now - millis).toISOString()}`);
    });
  });
  it('adds month query parameters to url', (): void => {
    const monthQuery = getQuery({ mode: 'Month', month: 4, year: 1999 });
    const monthUrl = withQueryString(URL, monthQuery);
    expect(monthUrl).toContain(`since=${new Date(1999, 3).toISOString()}`);
    expect(monthUrl).toContain(`until=${new Date(1999, 4).toISOString()}`);
  });
  it('adds query string query and additional parameters to url', (): void => {
    let queryStringQuery = getQuery({
      mode: 'Query string',
      queryString: 'color=DeepBlue',
    });
    let queryStringUrl = withQueryString(URL, queryStringQuery, {
      animal: 'cow',
    });
    expect(queryStringUrl).toEqual(`${URL}?color=DeepBlue&animal=cow`);

    queryStringQuery = getQuery({
      mode: 'Query string',
      queryString: undefined,
    });
    queryStringUrl = withQueryString(URL, queryStringQuery, { animal: 'cow' });
    expect(queryStringUrl).toEqual(`${URL}?animal=cow`);
  });
});
