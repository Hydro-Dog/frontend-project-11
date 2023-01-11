import { generateId } from '../src/utils.js';

test('generateId', () => {
  expect(
    generateId('This is my text').length,
  ).toEqual(20);
});
