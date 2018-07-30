/**
 * Testing helper functions
 * @flow
 */

import Position from '@/jackfish/Position';
import { WHITE } from '@/jackfish/declarations';
import type { Move, Pieces, CR } from '@/jackfish/declarations';

export const startingPosition: string =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/** Sample FEN positions for openings used for testing. The positions are
    sequential assuming the best moves are played according to
    stockfish.js 8 (10s). */
export const openings: Array<Array<string>> = [
  // queen's gambit
  [
    'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1',
    'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6 0 2',
    'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2',
    'rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3',
    'rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R b KQkq - 1 3',
    'rnbqkbnr/1pp2ppp/p3p3/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 4',
    'rnbqkbnr/1pp2ppp/p3p3/3P4/3P4/5N2/PP2PPPP/RNBQKB1R b KQkq - 0 4',
    'rnbqkbnr/1pp2ppp/p7/3p4/3P4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 5'
  ],

  // sicilian
  [
    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
    'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
    'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
    'rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3',
    'rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3',
    'rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4',
    'rnbqkbnr/pp2pppp/3p4/8/3QP3/5N2/PPP2PPP/RNB1KB1R b KQkq - 0 4',
    'rnbqkbnr/pp3ppp/3p4/4p3/3QP3/5N2/PPP2PPP/RNB1KB1R w KQkq e6 0 5',
  ]
];

/** Sample random positions with best moves according to
    stockfish.js 8 (10s). */
export const positions: Array<{pos: string, moves: Array<Move>}> = [
  {
    pos: 'r1bqkbnr/pp3ppp/2np4/4p3/4P3/4QN2/PPP2PPP/RNB1KB1R w KQkq - 2 6',
    moves: [[61, 34], [61, 25], [57, 42]]
  },
  {
    pos: 'r2qk1nr/pp2bppp/2npb3/4p3/2B1P3/3Q1N2/PPP2PPP/RNB1K2R w KQkq - 6 8',
    moves: [[60, 62], [57, 42], [34, 41]]
  },
  {
    pos: 'r2qk2r/pp2bppp/2npbn2/4p3/2B1P3/2NQ1N2/PPP2PPP/R1B2RK1 b kq - 9 9',
    moves: [[4, 6], [18, 33], [0, 2]]
  },
];

/** Create object with expected starting position properties */
export const startingProps = () => {
  const obj = {
    // order doesn't matter
    pieces: [
      { pos: 56, piece: 'R' },
      { pos: 57, piece: 'N' },
      { pos: 58, piece: 'B' },
      { pos: 59, piece: 'Q' },
      { pos: 60, piece: 'K' },
      { pos: 61, piece: 'B' },
      { pos: 62, piece: 'N' },
      { pos: 63, piece: 'R' },
      { pos: 0, piece: 'r' },
      { pos: 1, piece: 'n' },
      { pos: 2, piece: 'b' },
      { pos: 3, piece: 'q' },
      { pos: 4, piece: 'k' },
      { pos: 5, piece: 'b' },
      { pos: 6, piece: 'n' },
      { pos: 7, piece: 'r' },
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
    obj.pieces.push({ pos: i, piece: 'P' })
  }
  for (let i = 8; i < 16; i++) {
    obj.pieces.push({ pos: i, piece: 'p' })
  }
  return obj;
};

/**
 * Checks if position contains pieces both in pieces arrays and on board.
 */
export function checkPieces (position: Position, pieces: Pieces): boolean {
  // expect the position's board to include all pieces in pieces and
  // have the same number of pieces
  let c = 0; // counter
  for (let i = 0; i < 64; i++) {
    if (position.board[i]) {
      if (!pieces.find(e => position.board[i] === e.piece && i === e.pos)) {
        return false;
      } else c++;
    }
  }
  if (c !== pieces.length) return false;
  return true;
};

/** Checks the castling properties of a position. */
export function checkCastling (position: Position, wc: CR, bc: CR): boolean {
  return position.wc[0] === wc[0] && position.wc[1] === wc[1] &&
    position.bc[0] === bc[0] && position.bc[1] === bc[1];
};
