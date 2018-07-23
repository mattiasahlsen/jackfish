/**
 * Type and constants declarations.
 * @flow
 */

export const WHITE = 0;
export const BLACK = 1;
export const pieces = [
  'P', 'N', 'B', 'R', 'Q', 'K',
  'p', 'n', 'b', 'r', 'q', 'k'
];

export type Color = 0 | 1;
// ' ' means no piece
export type Piece = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K' |
                    'p' | 'n' | 'b' | 'r' | 'q' | 'k' | ' ';
export type PieceObj = {| pos: number, piece: Piece |};
// [white, black], piece objects may be any order
export type Pieces = [Array<PieceObj>, Array<PieceObj>];
export type Board = Array<Piece>;

export type Move = [number, number]; // [from, to]
export type CR = [boolean, boolean]; // castling rights [kingside, queenside]
