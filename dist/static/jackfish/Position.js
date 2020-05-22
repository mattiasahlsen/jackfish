/**
 * Position module.
 * @flow
 */

import { isColor, sameColor, next, colDif, rowDif,
  parse, squareToString } from './helpers';
import evaluate, { pst } from './evaluation';
import { WHITE, BLACK } from './declarations';
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
  halfMoveClock: number;

  score: number;
  hash: Hash;
  boardHash: Hash;

  prev: Position | void;

  constructor(
    boardOrFen: Board | string,
    turn: Color = WHITE,
    wc: CR = [true, true], // white castling rights
    bc: CR = [true, true], // black...
    ep: number = -1, // -1 if there is none
    kp: number = -1, // -1 if there is none
    halfMoveClock: number = 0, // defaults to 0

    // Score for color to move. If none is provided, calculates it from scratch.
    score?: number,
    myHash?: Hash,
    boardHash?: Hash,
  ) {
    // if we get a fen string: assumes it's a valid fen string
    if (typeof boardOrFen === 'string') {
      const fen = boardOrFen;
      this.board = [];
      this.wc = [false, false];
      this.bc = [false, false];
      this.ep = -1;
      this.kp = -1;

      const subs = fen.trim().split(/ +/); // get substrings

      let pos = 0; // current board position (square)
      let i = 0; // index of string
      // The board array is indexed the same way as FEN notation.
      while (i < subs[0].length) {
        let c = subs[0].charAt(i); // currently parsed char
        const num = parseInt(c);
        if (Number.isInteger(num)) {
          for (let j = 0; j < num; j++) {
            this.board[pos + j] = null;
          }
          pos += num;
        } else {
          // Cast to piece when we know it is one.
          c = ((c: any): Piece)
          this.board[pos] = c;
          pos++;
        }
        i++;
        if (pos >= 64) break; // should not be able to be bigger than 64
        else if (pos % 8 === 0) {
          i++;
        }
      }

      switch (subs[1]) {
        case 'w': this.turn = WHITE; break;
        case 'b': this.turn = BLACK; break;
        default: throw new Error('Invalid fen string');
      }

      if (subs[2] !== '-') {
        const used = [];
        for (let i = 0; i < subs[2].length; i++) {
          const c = subs[2].charAt(i);
          switch (c) {
            case 'Q': this.wc[0] = true; break;
            case 'K': this.wc[1] = true; break;
            case 'q': this.bc[1] = true; break;
            case 'k': this.bc[0] = true; break;
            default: throw new Error('Invalid fen string');
          }
          used.push(c);
        }
      }

      if (subs[3] !== '-') this.ep = parse(subs[3]);

      this.halfMoveClock = parseInt(subs[4]);
    } else {
      // else just copy all the parameters to fields.
      this.board = boardOrFen;
      this.turn = turn;
      this.wc = wc;
      this.bc = bc;
      this.ep = ep;
      this.kp = kp;
      this.halfMoveClock = halfMoveClock;
    }

    if (score !== undefined) this.score = score;
    else {
      this.score = this.turn === WHITE
        ? evaluate(this.board) : -evaluate(this.board);
    }

    if (myHash !== undefined) this.hash = myHash;
    else this.hash = hash((this: any));
    if (boardHash !== undefined) this.boardHash = boardHash;
    else this.boardHash = this.hashBoard();
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
    const ret = new Position(this.board.slice(), next(this.turn), this.wc, this.bc,
      -1, -1, this.halfMoveClock + 1,
      -this.score, this.hashNullMove(), this.boardHash);
    ret.prev = this;
    return ret;
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
    if (score === undefined) score = -(this.score + this.value(move, promo));

    let halfMoveClock;
    // will also be reset at pawn take
    if (board[t]) halfMoveClock = 0;
    else halfMoveClock = this.halfMoveClock + 1;

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
        halfMoveClock = 0;

        if (t - o === -16) ep = (t + o) / 2;
        else if (t === this.ep) board[t + 8] = null;
        else if (t <= H8) board[t] = (promo: any); // assume it's defined
      } else if (op === 'p') { // black
        halfMoveClock = 0;

        if (t - o === 16) ep = (t + o) / 2;
        else if (t === this.ep) board[t - 8] = null;
        else if (t >= A1) board[t] = (promo: any);
      }
    }

    const newHashes = this.hashMove(move, promo)

    const ret = new Position(board, next(this.turn), wc, bc, ep, kp,
      halfMoveClock, score, newHashes[0], newHashes[1]);
    ret.prev = this;
    return ret;
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

  /** Returns the resulting hashes ([posHash, boardHash]) from a move
      (position hash and board hash). Assumes it's a valid move. */
  hashMove(move: Move, promo?: Piece): [Hash, Hash] {
    const o = move[0];
    const t = move[1];
    const op: Piece = (this.board[o]: any);
    let tp = this.board[t];

    const newHash: Hash = (this.hash.slice(): any); // copy
    const newBoardHash: Hash = (this.boardHash.slice(): any);

    const applyHash = (hashParam: Hash) => {
      newHash[0] ^= hashParam[0];
      newHash[1] ^= hashParam[1];
    }
    const applyBoardHash = (hashParam: Hash) => {
      newBoardHash[0] ^= hashParam[0];
      newBoardHash[1] ^= hashParam[1];
    }

    // switch turn
    applyHash(hashes.turn);

    // if this position has an en passant or king passant, unhash it
    if (this.ep !== -1) applyHash(hashes.epFile[this.ep % 8]);
    if (this.kp !== -1) applyHash(hashes.kp[this.kp]);

    applyHash(hashes[op][o]);
    applyHash(hashes[op][t]);
    applyBoardHash(hashes[op][o]);
    applyBoardHash(hashes[op][t]);
    if (tp) {
      applyHash(hashes[tp][t]);
      applyBoardHash(hashes[tp][t]);
    }

    // castling
    if (op === 'K' && Math.abs(t - o) === 2) {
      const kp = (t + o) / 2;
      applyHash(hashes.wc[0]);
      applyHash(hashes.wc[1]);
      applyHash(hashes.kp[kp]);

      applyHash(hashes['R'][kp]);
      applyBoardHash(hashes['R'][kp]);
      if (t < o) {
        applyHash(hashes['R'][A1]);
        applyBoardHash(hashes['R'][A1]);
      } else {
        applyHash(hashes['R'][H1]);
        applyBoardHash(hashes['R'][H1]);
      }
    } else if (op === 'k' && Math.abs(t - o) === 2) {
      const kp = (t + o) / 2;
      applyHash(hashes.bc[0]);
      applyHash(hashes.bc[1]);
      applyHash(hashes.kp[kp]);

      applyHash(hashes['r'][kp]);
      applyBoardHash(hashes['r'][kp]);
      if (t < o) {
        applyHash(hashes['r'][A8]);
        applyBoardHash(hashes['r'][A8]);
      } else {
        applyHash(hashes['r'][H8]);
        applyBoardHash(hashes['r'][H8]);
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
          applyBoardHash(hashes[tp][t + 8]);
        } else if (t <= H8) {
          applyHash(hashes[op][t]);
          applyHash(hashes[promo || 'Q'][t]);
          applyBoardHash(hashes[op][t]);
          applyBoardHash(hashes[promo || 'Q'][t]);
        }
      } else if (op === 'p') {
        if (t - o === 16) applyHash(hashes.epFile[((t + o) / 2) % 8]);
        else if (t === this.ep) {
          tp = (this.board[t - 8]: any);
          applyHash(hashes[tp][t - 8]);
          applyBoardHash(hashes[tp][t - 8]);
        } else if (t >= A1) {
          applyHash(hashes[op][t]);
          applyHash(hashes[promo || 'q'][t]);
          applyBoardHash(hashes[op][t]);
          applyBoardHash(hashes[promo || 'q'][t]);
        }
      }
    }
    return [newHash, newBoardHash];
  }

  hashNullMove(): Hash {
    const newHash: Hash = (this.hash.slice(): any); // copy old hash
    const applyHash = (hashParam: Hash) => {
      newHash[0] ^= hashParam[0];
      newHash[1] ^= hashParam[1];
    }

    // if this position has an en passant or king passant, unhash it
    if (this.ep !== -1) applyHash(hashes.epFile[this.ep % 8]);
    if (this.kp !== -1) applyHash(hashes.kp[this.kp]);

    applyHash(hashes.turn);

    return newHash;
  }

  hashBoard(): Hash {
    const hash: Hash = [0, 0];

    for (let i = 0; i < 64; i++) {
      const p = this.board[i];
      if (p) {
        // apply hash
        hash[0] ^= hashes[p][i][0];
        hash[1] ^= hashes[p][i][1];
      }
    }
    return hash;
  }

  /**
   * Checks if a move is valid.
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

  /** Returns true if color is in check. If square is provided,
      checks if that square is threatened. */
  inCheck(color: Color = this.turn): boolean {
    let mySteps; // steps for different pieces
    let pawnSteps;
    let pawn;
    let kingSquare;
    if (color === WHITE) {
      // square position of king
      kingSquare = this.board.indexOf('K');

      mySteps = {
        'bq': steps.B,
        'rq': steps.R,
        'n': steps.N,
      };
      pawn = 'p';
      pawnSteps = [S + W, S + E];
    } else {
      kingSquare = this.board.indexOf('k');

      mySteps = {
        'BQ': steps.B,
        'RQ': steps.R,
        'N': steps.N,
      }
      pawn = 'P';
      pawnSteps = [N + W, N + E];
    }

    // search all steps for all pieces
    for (const key in mySteps) {
      for (let i = 0; i < mySteps[key].length; i++) {
        let t = kingSquare + mySteps[key][i];
        while (t >= 0 && t <= 63 && colDif(t, t - mySteps[key][i]) < 6) {
          if (this.board[t]) {
            if (key.includes(this.board[t])) return true;
            // pawns get special treatment
            if (this.board[t] === pawn &&
              (kingSquare === t + pawnSteps[0] ||
              kingSquare === t + pawnSteps[1])) {
              return true;
            }
            break;
          }

          if ('Nn'.includes(key)) break;
          t += mySteps[key][i];
        }
      }
    }
    return false;
  }

  // Get fen of the position (fullMove set to 1)
  toString() {
    let fen = '';
    let spaces = 0;
    for (let i = 0; i < 64; i++) {
      if (this.board[i] === null) spaces++;
      else {
        if (spaces > 0) {
          fen += spaces;
          spaces = 0;
        }
        fen += this.board[i];
      }
      if (i % 8 === 7) {
        if (spaces > 0) {
          fen += spaces;
          spaces = 0;
        }
        if (i < 63) fen += '/';
      }
    }

    fen += ' ';
    if (this.turn === WHITE) fen += 'w';
    else fen += 'b';

    fen += ' ';
    if (!this.wc[0] && !this.wc[1] && !this.bc[0] && !this.bc[1]) fen += '-';
    else {
      if (this.wc[1]) fen += 'K';
      if (this.wc[0]) fen += 'Q';
      if (this.bc[1]) fen += 'k';
      if (this.bc[0]) fen += 'q';
    }

    fen += ' ';
    if (this.ep !== -1) fen += squareToString(this.ep);
    else fen += '-';

    fen += ' ';
    fen += this.halfMoveClock;

    fen += ' ';
    fen += 1; // fullMove

    return fen;
  }
}
