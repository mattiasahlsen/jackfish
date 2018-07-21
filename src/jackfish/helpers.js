/**
 * Helper functions.
 * @flow
 */

import type { Piece } from './declarations';

export function isWhite(piece: Piece) {
  return piece.charAt(0) === piece.charAt(0).toUpperCase();
}
