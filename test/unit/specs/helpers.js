/**
 * Testing helper functions
 * @flow
 */

import Position from '@/jackfish/Position';
import { WHITE } from '@/jackfish/declarations';
import type { Pieces, PieceObj, CR } from '@/jackfish/declarations';

/** Create object with expected starting position properties */
export const startingProps = () => {
  const obj = {
    // order doesn't matter
    pieces: [
      [
        { pos: 56, piece: 'R' },
        { pos: 57, piece: 'N' },
        { pos: 58, piece: 'B' },
        { pos: 59, piece: 'Q' },
        { pos: 60, piece: 'K' },
        { pos: 61, piece: 'B' },
        { pos: 62, piece: 'N' },
        { pos: 63, piece: 'R' },
      ], [ // black
        { pos: 0, piece: 'r' },
        { pos: 1, piece: 'n' },
        { pos: 2, piece: 'b' },
        { pos: 3, piece: 'q' },
        { pos: 4, piece: 'k' },
        { pos: 5, piece: 'b' },
        { pos: 6, piece: 'n' },
        { pos: 7, piece: 'r' },
      ]
    ],
    turn: WHITE,
    wc: [true, true],
    bc: [true, true],
    ep: -1,
    kp: -1,
    halfMoveClock: 0,
    fullMove: 1
  };
  for (let i = 48; i < 56; i++) {
    obj.pieces[0].push({ pos: i, piece: 'P' })
  }
  for (let i = 8; i < 16; i++) {
    obj.pieces[1].push({ pos: i, piece: 'p' })
  }
  return obj;
};

/**
 * Checks if position contains pieces both in pieces arrays and on board.
 */
export function checkPieces (position: Position, pieces: Pieces): boolean {
  // expect the position's pieces arrays to include all pieces in pieces

  // check that including includes included
  const check = (including: Array<PieceObj>, included: Array<PieceObj>) => {
    for (let i = 0; i < included.length; i++) {
      const e1 = included[i];
      if (including.find(e2 => e1.piece === e2.piece && e1.pos === e2.pos) ===
        undefined) return false;
    }
    return true;
  }

  return check(position.pieces[0], pieces[0]) &&
    check(position.pieces[1], pieces[1]);
};
/** Checks the castling properties of a position. */
export function checkCastling (position: Position, wc: CR, bc: CR): boolean {
  return position.wc[0] === wc[0] && position.wc[1] === wc[1] &&
    position.bc[0] === bc[0] && position.bc[1] === bc[1];
};
