/**
 * Type and constants declarations.
 * @flow
 */

export const WHITE = 0;
export const BLACK = 1;

export type Color = 0 | 1;
export type Piece = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K' |
                    'p' | 'n' | 'b' | 'r' | 'q' | 'k' | ' ';
type PiecesHelper = Array<{ pos: number, piece: Piece }>;
export type Pieces = [PiecesHelper, PiecesHelper]; // [white, black]
export type Board = Array<Piece>;

export type Move = [number, number]; // [from, to]
export type CastlingRights = [boolean, boolean]; // [kingside, queenside]
