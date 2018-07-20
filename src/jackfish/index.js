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
 * @name Config
 * @property {string?} startPos The FEN string of the starting position.
 * @example
 * const config = {
 *   startPos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
 * }
 */
export type Config = {
  startPos?: string,
}

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

  constructor(options?: Config) {
    if (options) this.configure(options);
  }

  /**
   * Configurate the engine (only changes passed properties).
   * @example
   * // set starting position to standard
   * game.configure({ startPos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' });
   * @param options   Same type of configuration object passed to
   *                  constructor.
   */
  configure(options: Config): void {
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
   * Changes the position.
   * @param fen The FEN string of the position to be set.
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
