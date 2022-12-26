// eslint-disable-next-line import/extensions
import foo from '../src/index.js';

test('hello', () => {
  expect(
    foo(),
  ).toEqual(4);
});
