/**
 * Evaluation of a position.
 * @flow
 */

import { isWhite } from './helpers';

import type { Board, Piece } from './declarations';

// Piece values.
// King value is set to a very high value to easily detect when king is taken,
// and thereby detecting checkmate, and to always avoid it if possible.
export const PIECE = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 30000 };

// Piece-square tables.
// Index is index of position on the board for white, and for the board
// flipped for black.
// Taken from https://chessprogramming.wikispaces.com/Simplified%20evaluation%20function

/* eslint-disable */
export const pstRaw = {
  // pawn
  P: [
     0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
     5,  5, 10, 25, 25, 10,  5,  5,
     0,  0,  0, 20, 20,  0,  0,  0,
     5, -5,-10,  0,  0,-10, -5,  5,
     5, 10, 10,-20,-20, 10, 10,  5,
     0,  0,  0,  0,  0,  0,  0,  0
  ],
  // knight
  N: [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50,
  ],
  // bishop
  B: [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20,
  ],
  // rook
  R: [
     0,  0,  0,  0,  0,  0,  0,  0,
     5, 10, 10, 10, 10, 10, 10,  5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
     0,  0,  0,  5,  5,  0,  0,  0,
  ],
  // queen
  Q: [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
     -5,  0,  5,  5,  5,  5,  0, -5,
      0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20,
  ],
  // king
  K: [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
     20, 20,  0,  0,  0,  0, 20, 20,
     20, 30, 10,  0,  0, 10, 30, 20
  ]
};
/* eslint-enable */

// Join psts with piece values into a final pst, and add mirrored tables
// for black pieces
type Pst = {
  [piece: Piece]: Array<number>
};

export const pst: Pst = {};
for (const key in pstRaw) {
  const bKey: Piece = (key.toLowerCase(): any); // corresponding black piece key
  pst[(key: any)] = [];
  pst[bKey] = [];
  pstRaw[key].forEach((e, i) => {
    pst[(key: any)].push(e + PIECE[key])
    pst[bKey][56 - i + 2 * (i % 8)] = e + PIECE[key];
  });
}

/**
 * Gives the board value for white (negate for black's).
 */
export default function evaluate(board: Board): number {
  let value = 0;
  for (let i = 0; i < 64; i++) {
    if (board[i]) {
      const piece: Piece = board[i];
      if (isWhite(piece)) value += pst[piece][i];
      else value -= pst[piece][i];
    }
  }
  return value;
}
