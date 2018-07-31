/**
 * Helper functions.
 * @flow
 */

import { WHITE, BLACK } from './declarations';
import type { Piece, Color } from './declarations';

export function isWhite(piece: Piece): boolean {
  return piece.charAt(0) === piece.charAt(0).toUpperCase();
}

export function isColor(piece: Piece, color: Color): boolean {
  return color === WHITE ? isWhite(piece) : !isWhite(piece);
}

export function sameColor(p1: Piece, p2: Piece): boolean {
  return isWhite(p1) === isWhite(p2);
}

// Returns the other color.
export function next(c: Color): Color {
  return c === WHITE ? BLACK : WHITE;
}

export function rowDif(p1: number, p2: number): number {
  return Math.abs(Math.floor(p1 / 8) - Math.floor(p2 / 8));
}

export function colDif(p1: number, p2: number): number {
  return Math.abs(p1 % 8 - p2 % 8);
}

export function rank(p: number) {
  return 8 - Math.floor(p / 8)
}

/**
 * Parses a position on form 'f5'.
 * @return The corresponding number, or NaN if the string was invalid.
 */
export function parse(s: string) {
  if (s.length !== 2) return NaN;

  s = s.toLowerCase();
  const file = s.charCodeAt(0); // char representing file
  const rank = s.charCodeAt(1); // char representing rank
  const a = 'a'.charCodeAt(0);
  const h = 'h'.charCodeAt(0);
  if (!(file >= a && file <= h && rank >= 49 && rank <= 56)) {
    return NaN;
  }

  // 97 is ascii for 'a' and 49 for '1'
  return file - 97 + 56 - (rank - 49) * 8;
}

/**
 * Parses a position on number form to from 'f5'.
 * Assumes pos >= 0 && pos <= 63.
 * @return The string, or null if the number was invalid.
 */
export function squareToString(pos: number): string {
  const file: string = String.fromCharCode(pos % 8 + 97);
  const r: string = rank(pos).toString();
  return file.concat(r);
}
