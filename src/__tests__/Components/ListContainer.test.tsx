import { getListKey } from '../../Components/ListContainer';
import { ListPayload } from '../../Types/Statistics';

describe('getListKey', (): void => {
  it('returns name-type string', (): void => {
    expect(getListKey({ name: 'TEST_NAME' } as ListPayload)).toEqual(
      'TEST_NAME-list'
    );
  });
});
