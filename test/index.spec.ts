import * as index from '../src/index';

describe('Index', () => {
  test('should return 20 exports', () => {
    expect(Object.keys(index)).toHaveLength(20);
  });
});