/**
 * Position module.
 * @flow
 */

import { isColor, sameColor, next, colDif, rowDif } from './helpers';
import evaluate, { pst } from './evaluation';
import { WHITE } from './declarations';
import { hash, hashes } from './tp';

import type { Color, Board, Piece, Move, CR, Hash } from './declarations';

// some squares
export const A1 = 56;
export const H1 = 63;
export const A8 = 0;
export const H8 = 7;

// directions
const N = -8; // north
const E = 1; // east
const S = 8; // south
const W = -1; // west

/* eslint-disable */
// possible steps for different pieces
const steps = {};
steps.P = [N, 2*N, N+W, N+E]; // p[0] = white, p[1] = black
steps.N = [2*N+W, 2*N+E, 2*W+N, 2*W+S, 2*S+E, 2*S+W, 2*E+N, 2*E+S];
steps.B = [N+W, N+E, S+W, S+E];
steps.R = [N, E, S, W];
steps.Q = [N, N+E, E, S+E, S, S+W, W, N+W];
steps.K = [N, N+E, E, S+E, S, S+W, W, N+W];

// add for black pieces
for (const key in steps) {
  steps[key.toLowerCase()] = steps[key];
}
// black pawns can only move opposite direction
steps.p = [];
for (let i = 0; i < steps.P.length; i++) steps.p.push(-steps.P[i]);

/* eslint-enable */

/**
 * A complete position of a chess game.
 */
export default class Position {
  board: Board;
  turn: Color;
  wc: CR;
  bc: CR;
  ep: number;
  kp: number;
  score: number;
  hash: Hash;

  constructor(
    board: Board,
    turn: Color,
    wc: CR, // white castling rights
    bc: CR, // black...
    ep: number = -1, // -1 if there is none
    kp: number = -1, // -1 if there is none
    // Score for color to move. If none is provided, calculates it from scratch.
    score?: number,
    myHash?: Hash) { // if none is provided, calculates it from scratch
    // just copy all the parameters to fields.
    this.turn = turn;
    this.board = board;
    this.wc = wc;
    this.bc = bc;
    this.ep = ep;
    this.kp = kp;
    if (score) this.score = score;
    else {
      this.score = this.turn === WHITE
        ? evaluate(this.board) : -evaluate(this.board);
    }

    // must come last
    if (myHash) this.hash = myHash;
    else this.hash = hash((this: any));
  }

  /**
   * Returns possible moves for color, including moves that result in king-take
   * and castles invalid because of threatened squares or check. For pawn
   * promotions, it will only generate one move without the promotion piece.
   * You must later add the promotion piece for the move to be valid.
   * @param [color=this.turn] The color to look for moves for.
   */
  *genMoves(color?: Color = this.turn): Generator<Move, void, void> {
    for (let i = 0; i < this.board.length; i++) {
      const piece = this.board[i];
      if (piece === null || !isColor(piece, color)) continue;

      // check for castling
      if (piece.toUpperCase() === 'K') {
        const rights = color === WHITE ? this.wc : this.bc;
        if (rights[0] && this.board[i - 1] === null &&
          this.board[i - 2] === null) yield ([i, i - 2]: Move);
        if (rights[1] && this.board[i + 1] === null &&
          this.board[i + 2] === null) yield ([i, i + 2]: Move);
      }

      for (let j = 0; j < steps[piece].length; j++) {
        const step = steps[piece][j];
        // if step is two steps, it must be a pawn
        if ((step === 2 * N && i < A1 - 8) ||
          (step === 2 * S && i > H8 + 8)) continue;

        let t = i + step; // target square

        // keep within bounds of board
        while (t >= 0 && t <= 63 && colDif(t, t - step) < 6) {
          const tp = this.board[t]; // target piece (or null)

          // pawns get special treatment
          if (piece.toUpperCase() === 'P') {
            if (colDif(i, t) === 0 && tp !== null) break;
            if (rowDif(i, t) === 2 && this.board[i + step / 2] !== null) break;
            if (colDif(i, t) === 1 && t !== this.ep &&
              (tp === null || sameColor(tp, piece))) break;
          } else if (tp !== null) {
            if (!sameColor(tp, piece)) {
              yield ([i, t]: Move);
            }
            break;
          }

          yield ([i, t]: Move);
          if ('KkNnPp'.includes(piece)) break;
          t += step;
        }
      }
    }
  }

  /**
   * Makes a nullmove, i.e. switches turn, resets en passant and negates score.
   */
  nullMove(): Position {
    // copying board with slice, works because it's shallow
    return new Position(this.board.slice(),
      next(this.turn), this.wc, this.bc, -1, -1, -this.score);
  }

  /**
   * Makes the move and returns the new position. Does not alter this
   * position. Assumes that the move is valid.
   * @param move  The move
   * @param promo If there is a promotion of a pawn, this is the piece to
   *              replace it with. Default to Queen.
   * @param score Optional to pass score to avoid calculating it twice
   * @return      The new position.
   */
  move(move: Move, promo?: Piece, score?: number): Position {
    const o = move[0]; // origin square
    const t = move[1]; // target square
    // it's assumed that there is a piece at the origin position,
    // toUpperCase() makes it generic because color doesn't matter
    const op: Piece = (this.board[o]: any);
    if (!promo) {
      if (this.turn === WHITE) promo = 'Q'; // default promotion piece
      else promo = 'q';
    }

    const board = this.board.slice(); // copy board
    let wc: CR = (this.wc.slice(): any); // copy castling rights
    let bc: CR = (this.bc.slice(): any);
    let ep = -1; // default
    let kp = -1;
    // negate score so it's for the other side
    score = score || -(this.score + this.value(move, promo));

    // make the move
    board[t] = board[o];
    board[o] = null;

    // castle
    if (op === 'K') {
      wc = [false, false];
      if (Math.abs(t - o) === 2) {
        kp = (o + t) / 2;
        board[kp] = 'R';
        board[t < o ? A1 : H1] = null;
      }
    } else if (op === 'k') {
      bc = [false, false];
      if (Math.abs(t - o) === 2) {
        kp = (o + t) / 2;
        board[kp] = 'r';
        board[t < o ? A8 : H8] = null;
      }
    } else {
      // set castling rights
      const helper = (p) => {
        switch (p) {
          case A1: wc[0] = false; break;
          case H1: wc[1] = false; break;
          case A8: bc[0] = false; break;
          case H8: bc[1] = false; break;
          default: break;
        }
      }
      helper(o);
      helper(t);

      // double move, en passant and pawn promotion
      if (op === 'P') { // white
        if (t - o === -16) ep = (t + o) / 2;
        else if (t === this.ep) board[t + 8] = null;
        else if (t <= H8) board[t] = (promo: any); // assume it's defined
      } else if (op === 'p') { // black
        if (t - o === 16) ep = (t + o) / 2;
        else if (t === this.ep) board[t - 8] = null;
        else if (t >= A1) board[t] = (promo: any);
      }
    }

    return new Position(board, next(this.turn), wc, bc, ep, kp, score);
  }

  /**
   * Returns the value (change of position score) of a move. Assumes it's valid.
   */
  value(move: Move, promo?: Piece): number {
    const o = move[0];
    const t = move[1];
    const op: Piece = (this.board[o]: any);
    let tp: Piece = (this.board[t]: any);

    // invalid castling detection, returns MAX_SAFE_INTEGER if last move's
    // castle was invalid (if king is threatened on any of the squares
    // it moves over)
    if (this.kp !== -1 && Math.abs(t - this.kp) < 2) return 30000;

    let score = pst[op][t] - pst[op][o];
    // capture
    if (tp) score += pst[tp][t];

    // castling
    if (op === 'K' && Math.abs(t - o) === 2) {
      score += pst['R'][(t + o) / 2];
      score -= t < o ? pst['R'][A1] : pst['R'][H1];
    } else if (op === 'k' && Math.abs(t - o) === 2) {
      score += pst['r'][(t + o) / 2];
      score -= t < o ? pst['r'][A8] : pst['r'][H8];
    }

    // pawn stuff
    if (op === 'P') {
      if (t <= H8) score += pst[promo || 'Q'][t] - pst[op][t];
      else if (t === this.ep) {
        tp = (this.board[t + 8]: any);
        score += pst[tp][t + 8];
      }
    } else if (op === 'p') {
      if (t >= A1) score += pst[promo || 'q'][t] - pst[op][t];
      else if (t === this.ep) {
        tp = (this.board[t - 8]: any);
        score += pst[tp][t - 8];
      }
    }
    return score;
  }

  /** Returns the resulting hash from a move. Assumes it's a valid
      move. */
  hashMove(move: Move, promo?: Piece) {
    const o = move[0];
    const t = move[1];
    const op: Piece = (this.board[o]: any);
    let tp = this.board[t];

    const newHash = this.hash.slice(); // copy

    const applyHash = (hashParam: Hash) => {
      newHash[0] ^= hashParam[0];
      newHash[1] ^= hashParam[1];
    }

    // switch turn
    applyHash(hashes.turn);

    // if this position has an en passant, unhash it
    if (this.ep !== -1) applyHash(hashes.epFile[this.ep % 8]);

    applyHash(hashes[op][o]);
    applyHash(hashes[op][t]);
    if (tp) applyHash(hashes[tp][t]);

    // castling
    if (op === 'K' && Math.abs(t - o) === 2) {
      applyHash(hashes.wc[0]);
      applyHash(hashes.wc[1]);

      applyHash(hashes['R'][(t + o) / 2]);
      if (t < o) {
        applyHash(hashes['R'][A1]);
      } else {
        applyHash(hashes['R'][H1]);
      }
    } else if (op === 'k' && Math.abs(t - o) === 2) {
      applyHash(hashes.bc[0]);
      applyHash(hashes.bc[1]);

      applyHash(hashes['r'][(t + o) / 2]);
      if (t < o) {
        applyHash(hashes['r'][A8]);
        applyHash(hashes.bc[0]);
      } else {
        applyHash(hashes['r'][H8]);
        applyHash(hashes.bc[1]);
      }
    } else {
      const helper = (p) => {
        switch (p) {
          case A1: if (this.wc[0]) applyHash(hashes.wc[0]); break;
          case H1: if (this.wc[1]) applyHash(hashes.wc[1]); break;
          case A8: if (this.bc[0]) applyHash(hashes.bc[0]); break;
          case H8: if (this.bc[1]) applyHash(hashes.bc[1]); break;
          default: break;
        }
      }
      helper(o);
      helper(t);

      // pawn stuff
      if (op === 'P') {
        // hash en passant
        if (t - o === -16) applyHash(hashes.epFile[((t + o) / 2) % 8]);
        else if (t === this.ep) {
          tp = (this.board[t + 8]: any);
          applyHash(hashes[tp][t + 8]);
        } else if (t <= H8) {
          applyHash(hashes[op][t]);
          applyHash(hashes[promo || 'Q'][t]);
        }
      } else if (op === 'p') {
        if (t - o === 16) applyHash(hashes.epFile[((t + o) / 2) % 8]);
        else if (t === this.ep) {
          tp = (this.board[t - 8]: any);
          applyHash(hashes[tp][t - 8]);
        } else if (t >= A1) {
          applyHash(hashes[op][t]);
          applyHash(hashes[promo || 'q'][t]);
        }
      }
    }

    return newHash;
  }

  /**
   * Checks if a move is valid, not taking into account promotion piece argument
   * on pawn promotion.
   */
  valid(move: Move): boolean {
    const moves = this.genMoves(); // generator
    let el = moves.next();
    while (!el.done) {
      if (move[0] === el.value[0] && move[1] === el.value[1]) {
        const nextPos = this.move(move);
        const nextMoves = nextPos.genMoves();
        let nextEl = nextMoves.next();
        while (!nextEl.done) {
          // check if the move was an invalid castle
          if (nextPos.kp !== -1 && Math.abs(nextEl.value[1] - nextPos.kp) < 2) {
            return false;
          }
          // check if the move results in king being taken
          const tp = nextPos.board[nextEl.value[1]];
          if (tp !== null && 'Kk'.includes(tp)) return false;
          nextEl = nextMoves.next();
        }
        // if it passed all the tests, return true
        return true;
      }
      el = moves.next();
    }
    return false;
  }

  /** Returns true if side to move is in check. */
  inCheck(): boolean {
    // generate moves for other color
    const moves = this.genMoves(next(this.turn));
    let el = moves.next();
    while (!el.done) {
      const tp = this.board[el.value[1]]; // target piece
      if (tp && 'Kk'.includes(tp)) return true;
      el = moves.next();
    }
    return false;
  }
}
