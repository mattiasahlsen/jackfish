/**
 * A javascript chess engine inspired by
 * [sunfish](https://github.com/thomasahle/sunfish) and
 * [chess.js](https://github.com/jhlywa/chess.js).
 * @module jackfish
 * @author Mattias Ahlsén (mattias.ahlsen@gmail.com)
 * @example
 * import Engine from 'jackfish';
 * const game = new Engine();
 *
 * @flow
 */

type Square = number | string;

import type { Board, Piece, Move, CR } from './declarations';
import { pieces, BLACK, WHITE } from './declarations';
import Position from './Position';
import { rank, parse, squareToString, next, equalBoards } from './helpers';

/*
The board is represented as an array with indexes like this:
8 |  0  1  2  3  4  5  6  7
7 |  8  9  10 11 12 13 14 15
6 |  16 17 18 19 20 21 22 23
5 |  24 25 26 27 28 29 30 31
4 |  32 33 34 35 36 37 38 39
3 |  40 41 42 43 44 45 46 47
2 |  48 49 50 51 52 53 54 55
1 |  56 57 58 59 60 61 62 63
  |_________________________
     A  B  C  D  E  F  G  H

Pieces are represented as characters with uppercase letters for white pieces
and lowercase for black pieces, as in FEN notation:
Pawn: 'P' and 'p'
Knight: 'N' and 'n'
Bishop: 'B' and 'b'
Rook: 'R' and 'r'
Queen: 'Q' and 'q'
King: 'K' and 'k'
*/

/**
 * Configuration object for the engine.
 * @name Options
 * @property {string?} startPos The FEN string of the starting position.
 * @property {boolean?} fiftyMoveRule Use the fifty-move rule.
 * @property {boolean?} threefoldRepetition Use the threefold repetition rule.
 * @example
 * const options = {
 *   startPos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
     fiftyMoveRule: true,
     inThreefoldRepetition: true,
 * }
 */
export type Options = {
  startPos?: string,
  fiftyMoveRule?: boolean,
  threefoldRepetition?: boolean,
};

type Config = {
  startPos: string,
  fiftyMoveRule: boolean,
  threefoldRepetition: boolean,
};

const defaultConfig: Config = {
  startPos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  fiftyMoveRule: true,
  threefoldRepetition: true,
};

/**
 * The chess engine, including game mechanics and
 * a configurable AI. (default export)
 * @example const game = new Engine();
 * @param options Configuration object.
 * @param {string}
 * [options.startPos='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1']
 * See {@link Options}.
 * @param {boolean}
 * [options.fiftyMoveRule=true]
 * @param {boolean}
 * [options.threefoldRepetition=true]
 *
 * @return {Engine}
 */
export default class Engine {
  config: Config = defaultConfig;
  history: Array<{fen: string, move: Move}> = [];
  position: Position;
  halfMoveClock: number; // keep this here to keep Position class simpler
  fullMove: number; // full move number we're on (starts at 1)

  constructor(options?: Options) {
    if (options) this.configure(options);
    this.setPos(this.config.startPos);
  }

  /**
   * Configurate the engine (only changes passed properties).
   * @example
   * // set starting position to standard
   * game.configure({ startPos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' });
   * @param options   Same type of configuration object passed to
   *                  constructor.
   */
  configure(options: Options): void {
    for (const key in options) {
      this.config[key] = options[key];
    }
  }

  /**
   * Get the current configuration, including all default values.
   * @return The configuration object.
   */
  getConfig(): Config {
    return this.config;
  }

  /**
   * Changes to the new position and clears history array.
   * @param fen The FEN string of the position to be set.
   * @return True if the FEN string was valid enough and the position was
   *         successfully changed.
   */
  setPos(fen: string): boolean {
    const board: Board = [];
    let turn;
    let wc: CR = [false, false];
    let bc: CR = [false, false];
    let ep = -1; // default is none
    let kp = -1;
    let halfMoveClock;
    let fullMove;

    const subs = fen.trim().split(/ +/); // get substrings
    if (subs.length !== 6) return false;

    let pos = 0; // current board position (square)
    let i = 0; // index of string
    // The board array is indexed the same way as FEN notation.
    while (i < subs[0].length) {
      let c = subs[0].charAt(i); // currently parsed char
      const num = parseInt(c);
      if (Number.isInteger(num) && num > 0) {
        if (num > 8 - pos % 8) return false;
        for (let j = 0; j < num; j++) {
          board[pos + j] = null;
        }
        pos += num;
      } else if (pieces.includes(c)) {
        // Cast to piece when we know it is one.
        c = ((c: any): Piece)
        board[pos] = c;
        pos++;
      } else {
        return false; // invalid FEN
      }
      i++;
      if (pos >= 64) break; // should not be able to be bigger than 64
      else if (pos % 8 === 0) {
        if (subs[0].charAt(i) !== '/') return false;
        i++;
      }
    }
    if (fen.charAt(i) !== ' ') return false;

    switch (subs[1]) {
      case 'w': turn = WHITE; break;
      case 'b': turn = BLACK; break;
      default: return false;
    }

    if (subs[2] !== '-') {
      if (subs[2].length > 4) return false;
      const used = [];
      for (let i = 0; i < subs[2].length; i++) {
        const c = subs[2].charAt(i);
        if (used.includes(c)) return false; // may only occur once
        switch (c) {
          case 'Q': wc[0] = true; break;
          case 'K': wc[1] = true; break;
          case 'q': bc[1] = true; break;
          case 'k': bc[0] = true; break;
          default: return false;
        }
        used.push(c);
      }
    }

    if (subs[3] !== '-') {
      ep = parse(subs[3]);
      const r = rank(ep);
      if (isNaN(ep)) return false;
      if (r !== 3 && r !== 6) return false;
    }

    halfMoveClock = parseInt(subs[4]);
    fullMove = parseInt(subs[5]);
    if (!(Number.isInteger(halfMoveClock) && halfMoveClock >= 0)) return false;
    if (!(Number.isInteger(fullMove) && fullMove > 0)) return false;

    // if we've made it this far, we're golden
    this.halfMoveClock = halfMoveClock;
    this.fullMove = fullMove;
    this.position = new Position(board, turn, wc, bc, ep, kp);
    return true;
  }

  /**
   * Returns the FEN representation of the game.
   * @return The FEN string.
   */
  fen(): string {
    const pos = this.position;
    const board = pos.board;
    let fen = '';
    let spaces = 0;
    for (let i = 0; i < 64; i++) {
      if (board[i] === null) spaces++;
      else {
        if (spaces > 0) {
          fen += spaces;
          spaces = 0;
        }
        fen += board[i];
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
    if (pos.turn === WHITE) fen += 'w';
    else fen += 'b';

    fen += ' ';
    if (!pos.wc[0] && !pos.wc[1] && !pos.bc[0] && !pos.bc[1]) fen += '-';
    else {
      if (pos.wc[1]) fen += 'K';
      if (pos.wc[0]) fen += 'Q';
      if (pos.bc[1]) fen += 'k';
      if (pos.bc[0]) fen += 'q';
    }

    fen += ' ';
    if (pos.ep !== -1) fen += squareToString(pos.ep);
    else fen += '-';

    fen += ' ';
    fen += this.halfMoveClock;

    fen += ' ';
    fen += this.fullMove;

    return fen;
  }

  /**
   * Moves from position o to position t, making sure it's a valid move.
   * Positions can be on the form 0 for A8, 7 for H8, ..., 56 for A1,
   * 63 for H1, or simply on the form 'a1', 'b7', etc...
   * @param o Origin position.
   * @param t Target position.
   * @return True if it was a valid move.
   */
  move(o: Square, t: Square, promo?: Piece): boolean {
    // parse() returns NaN for invalid position strings
    if (typeof o === 'string') o = (parse(o): number);
    if (typeof t === 'string') t = (parse(t): number);

    const pos = this.position;
    if (pos.valid([o, t])) {
      if ('Pp'.includes((pos.board[o]: any)) || pos.board[t] !== null) {
        this.halfMoveClock = 0;
      } else this.halfMoveClock += 1;

      this.history.push({fen: this.fen(), move: [o, t]});
      this.position = this.position.move([o, t], promo);
      if (this.position.turn === WHITE) this.fullMove += 1;
      return true;
    }
    return false;
  }

  /**
   * Undoes the latest move if there is one.
   * @return True if there was a move to be undone.
   */
  undoMove(): boolean {

  }

  /**
   * Let the AI make a move.
   * @return Returns true if there was a valid move to be made,
   *         otherwise false.
   */
  aiMove(): Move {

  }

  /**
   * Get winner if there is one.
   */
  winner(): 'white' | 'black' | 'draw' | null {
    if (this.inCheckMate()) {
      if (this.position.turn === WHITE) return 'black';
      else return 'white';
    }

    if ((this.config.fiftyMoveRule && this.fiftyMoves()) ||
      (this.config.threefoldRepetition && this.inThreefoldRepetition()) ||
      (this.inStaleMate())) return 'draw'

    return null;
  }

  /** Returns true if in draw according to fifty move rule. */
  fiftyMoves(): boolean {
    return this.halfMoveClock >= 50;
  }

  /** Returns true if the current board position has ocurred 3 or more times. */
  inThreefoldRepetition(): boolean {
    let count = 1; // starts at 1 because current position is 1 occurence
    for (let i = 0; i < this.history.length; i++) {
      const game = new Engine();
      game.setPos(this.history[i].fen);
      if (equalBoards(game.position.board, this.position.board)) {
        count++;
        if (count === 3) return true;
      }
    }
    return false;
  }

  /** Returns true if side to move is in check. */
  inCheck(): boolean {
    // generate moves for other color
    const moves = this.position.genMoves(next(this.position.turn));
    let el = moves.next();
    while (!el.done) {
      const tp = this.position.board[el.value[1]]; // target piece
      if (tp && 'Kk'.includes(tp)) return true;
      el = moves.next();
    }
    return false;
  }

  /**
   * Check if side to move is in checkmate.
   */
  inCheckMate(): boolean {
    return this.moves().length === 0 && this.inCheck();
  }

  /**
   * Check if in stalemate.
   */
  inStaleMate(): boolean {
    return this.moves().length === 0 && !this.inCheck();
  }

  /** Returns an array of valid moves. */
  moves(): Array<Move> {
    const moves = [];
    const generator = this.position.genMoves(); // move generator
    let el = generator.next();
    while (!el.done) {
      if (this.position.valid(el.value)) moves.push(el.value);
      el = generator.next();
    }
    return moves;
  }

  /** Returns true if a move is valid */
  valid(o: Square, t: Square): boolean {
    if (typeof o === 'string') o = parse(o);
    if (typeof t === 'string') t = parse(t);

    return this.position.valid([o, t]);
  }

  /**
   * Sets position to the starting position set in config.startingPos (default
   * is normal starting position).
   */
  restart(): void {
    this.setPos(this.config.startPos);
  }
}
