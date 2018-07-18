/**
 * A chess engine inspired by [sunfish](https://github.com/thomasahle/sunfish).  
 * @module jackfish
 * @author Mattias Ahlsén (mattias.ahlsen@gmail.com)
 * @example
 * import Engine from 'jackfish';
 * const game = new Engine();
 *
 * @flow Uses flow types
 */

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
 * @typedef {Object} Config
 * @property {string} startPos The FEN string of the starting position.
 * @example
 * const config = {
 *   startPos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
 * }
 */
type Config = {
  startPos?: string,
}

/**
 * The chess engine, including game mechanics and
 * a configurable AI. (default export)
 * @example const game = new Engine();
 * @param config Configuration object.
 * @param {string}
 * [config.position='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1']
 * Position. Defaults to standard starting position.
 *
 * @return {Engine}
 */
export default class Engine {
  constructor(config?: Config): Engine {

  }

  /**
   * Configurate the engine (only changes passed properties).
   * @example
   * // reset to starting position
   * game.config({ position: ''rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1});
   * @param options   Same type of configuration object passed to
   *                  constructor.
   */
  config(options: Config): void {

  }

  /**
   * Get the current configuration, including all default values.
   * @return The configuration object.
   */
  getConfig(): Config {

  }

  /**
   * Changes the position.
   * @param {string} fen The FEN string of the position to be set.
   * @return True if the FEN string was valid and the position was
   *         successfully changed.
   */
  setPos(fen: string): boolean {

  }

  /**
   * Returns the FEN representation of the game.
   * @return The FEN string.
   */
  fen(): string {

  }

  /**
   * Moves from position o to position t, making sure it's a valid move.
   * @param  {number} o Origin position.
   * @param  {number} t Target position.
   * @return {boolean}  True if it was a valid move.
   */
  move(o: number, t: number): boolean {

  }

  /**
   * Undoes the latest move if there is one.
   * @return {boolean} True if there was a move to be undone.
   */
  undoMove(): boolean {

  }

  /**
   * Let the AI make a move.
   * @return {boolean} Returns true if there was a valid move to be made,
   *                   otherwise false.
   */
  aiMove(): boolean {

  }

  /**
   * Get the color of the winner.
   * @return {string | null}  Name of winner (or tie) if game is over,
   *                          else null.
   */
  winner(): "white" | "black" | "tie" | null {

  }

  /**
   * Sets position to the starting position set in config.startingPos.
   */
  restart(): void {

  }
}
