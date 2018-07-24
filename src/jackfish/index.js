/**
 * A javascript chess engine inspired by [sunfish](https://github.com/thomasahle/sunfish).
 * @module jackfish
 * @author Mattias Ahlsén (mattias.ahlsen@gmail.com)
 * @example
 * import Engine from 'jackfish';
 * const game = new Engine();
 *
 * @flow
 */

import type { Board, Piece, Pieces, CR } from './declarations';
import { pieces, BLACK, WHITE } from './declarations';
import { isWhite } from './helpers';
import Position from './Position';

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
 * @example
 * const options = {
 *   startPos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
 * }
 */
export type Options = {
  startPos?: string,
};

type Config = {
  startPos: string,
};

const defaultConfig: Config = {
  startPos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
};

/**
 * The chess engine, including game mechanics and
 * a configurable AI. (default export)
 * @example const game = new Engine();
 * @param options Configuration object.
 * @param {string}
 * [options.startPos='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1']
 * Starting position. Defaults to standard starting position.
 *
 * @return {Engine}
 */
export default class Engine {
  config: Config = defaultConfig;
  history: Array<Position> = [];
  position: Position;

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
    for (const key in options) this.config[key] = options[key];
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
    const boardPieces: Pieces = [[], []]; // 'pieces' name already taken
    let turn;
    let wc: CR = [false, false];
    let bc: CR = [false, false];
    let ep = -1; // default is none
    let kp = -1;
    let halfMoveClock;
    let fullMove;

    const subs = fen.trim().split(/ +/); // get substrings
    if (subs.length !== 6) return false;

    let pos = 0; // current board position
    let i = 0; // index of string
    // The board array is indexed the same way as FEN notation.
    while (i < subs[0].length) {
      let c = subs[0].charAt(i); // currently parsed char
      const num = parseInt(c);
      if (Number.isInteger(num) && num > 0) {
        if (num > 8 - pos % 8) return false;
        pos += num;
      } else if (pieces.includes(c)) {
        // Cast to piece when we know it is one.
        c = ((c: any): Piece)
        board[pos] = ((c: any): Piece);
        // add to pieces array
        if (isWhite(c)) boardPieces[0].push({ pos, piece: c });
        else boardPieces[1].push({ pos, piece: c });
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
          case 'K': wc[0] = true; break; // breaks out of switch
          case 'Q': wc[1] = true; break;
          case 'k': bc[0] = true; break;
          case 'q': bc[1] = true; break;
          default: return false;
        }
        used.push(c);
      }
    }

    if (subs[3] !== '-') {
      if (subs[3].length !== 2) return false;
      const c1 = subs[3].charCodeAt(0);
      const c2 = subs[3].charCodeAt(1);
      if (!(c1 >= 97 && c1 <= 104 && c2 >= 49 && c2 <= 56)) return false;

      // 97 is ascii for 'a' and 49 for '1'
      ep = c1 - 97 + 56 - (c2 - 49) * 8;
    }

    halfMoveClock = parseInt(subs[4]);
    fullMove = parseInt(subs[5]);
    if (!(Number.isInteger(halfMoveClock) && halfMoveClock >= 0)) return false;
    if (!(Number.isInteger(fullMove) && fullMove > 0)) return false;

    // if we've made it this far, we're golden
    this.position = new Position(
      board, boardPieces, turn, wc, bc, ep, kp, halfMoveClock, fullMove
    );
    return true;
  }

  /**
   * Returns the FEN representation of the game.
   * @return The FEN string.
   */
  fen(): string {

  }

  /**
   * Moves from position o to position t, making sure it's a valid move.
   * @param o Origin position.
   * @param t Target position.
   * @return True if it was a valid move.
   */
  move(o: number, t: number): boolean {

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
  aiMove(): boolean {

  }

  /**
   * Get winner if there is one.
   */
  winner(): "white" | "black" | "tie" | null {

  }

  /**
   * Sets position to the starting position set in config.startingPos.
   */
  restart(): void {

  }
}
