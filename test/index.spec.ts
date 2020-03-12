import * as index from '../src/index';

describe('Index', () => {
  test('should return 17 exports', () => {
    expect(Object.keys(index)).toHaveLength(17);
  });
});