/**
 * Tests for jackfish/helpers.js
 * @flow
 */

import { isWhite, sameColor } from '@/jackfish/helpers';

test('isWhite', () => {
  expect(isWhite('Q')).toBe(true);
  expect(isWhite('q')).toBe(false);
})
test('sameColor', () => {
  expect(sameColor('p', 'q')).toBe(true);
  expect(sameColor('b', 'N')).toBe(false);
  expect(sameColor('k', 'k')).toBe(true);
  expect(sameColor('k', 'K')).toBe(false);
})
