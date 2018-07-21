/**
 * Position module.
 * @flow
 */

import type { BLACK, WHITE, Color, Board,
  Pieces, Move, CastlingRights } from './declarations';

import evaluate, { piece, pst } from './evaluation';

/* eslint-disable */
// directions
const N = -8; // north
const E = 1; // east
const S = 8; // south
const W = -1; // west

const steps = {
  p: [[N, 2*N, N+W, N+E], [S, 2*S, S+W, S+E]], // p[0] = white, p[1] = black
  n: [2*N+W, 2*N+E, 2*W+N, 2*W+S, 2*S+E, 2*S+W, 2*E+N, 2*E+S],
  b: [N+W, N+E, S+W, S+E],
  r: [N, E, S, W],
  q: [N, N+E, E, S+E, S, S+W, W, N+W],
  k: [N, N+E, E, S+E, S, S+W, W, N+W],
};

/* eslint-enable */

/**
 * A complete position of a chess game.
 */
export default class Position {
  turn: Color;
  board: Board;
  pieces: Pieces;
  wc: CastlingRights;
  bc: CastlingRights;
  score: number;
  ep: number;
  kp: number;

  constructor(
    turn: Color,
    board: Board,
    pieces: Pieces, // black...
    wc: CastlingRights, // white castling rights
    bc: CastlingRights, // black...
    ep: number,
    kp: number,
    score: number) {
    // just copy all the parameters to fields.
    this.turn = turn;
    this.board = board;
    this.pieces = pieces;
    this.wc = wc;
    this.bc = bc;
    this.ep = ep;
    this.kp = kp;
    this.score = score;
  }

  /**
   * Returns valid moves (including moves that result in king-take).
   */
  geMoves(): Array<Move> {
    for (let i = 0; i < this.pieces[this.turn].length; i++) {

    }
  }

  /**
   * Makes a nullmove, i.e. switches turn and negates score.
   */
  nullMove(): void {

  }

  /**
   * Makes the move and returns the new position. Does not alter this
   * position.
   */
  move(move: Move): Position {

  }

  /**
   * Returns the value of a move.
   */
  value(move: Move): number {

  }
}
