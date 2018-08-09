/**
 * Type and constants declarations.
 * @flow
 */

export const WHITE = 0;
export const BLACK = 1;
export const PIECES = [
  'P', 'N', 'B', 'R', 'Q', 'K',
  'p', 'n', 'b', 'r', 'q', 'k'
];

export type Color = 0 | 1;
// ' ' means no piece
export type Piece = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K' |
                    'p' | 'n' | 'b' | 'r' | 'q' | 'k';
// [white, black], piece objects may be any order
// must have no empty elements
export type Board = Array<Piece | null>;

export type Move = [number, number]; // [from, to]
export type CR = [boolean, boolean]; // castling rights [queenside, kingside]

// used for testing
export type PieceObj = {| pos: number, piece: Piece |};
export type Pieces = Array<PieceObj>;

export type Hash = [number, number];
