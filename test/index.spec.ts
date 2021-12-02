import * as index from '../src/index';

describe('Index', () => {
  test('should return 21 exports', () => {
    expect(Object.keys(index)).toHaveLength(21);
  });
});
