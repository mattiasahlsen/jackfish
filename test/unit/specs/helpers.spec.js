/**
 * Tests for jackfish/helpers.js
 * @flow
 */

import { isWhite } from '@/jackfish/helpers';

declare var test;
declare var expect;

test('isWhite', () => {
  expect(isWhite('Q')).toBe(true);
  expect(isWhite('q')).toBe(false);
})
