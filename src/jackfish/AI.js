/**
 * @module AI
 * The "AI", or computer mover.
 * @flow
 */

import Position from './Position';
import type { Move } from './declarations';

// Helpers;


function negaMax(
  pos: Position,
  depth: number,
  alpha: number,
  beta: number): { pv: Array<Move>, score: number } {

}

function mtdf(pos: Position, depth: number, guess: number) {
  const bound = { lower: Number.MIN_SAFE_INTEGER, upper: Number.MAX_SAFE_INTEGER };
  let beta;
  let f = guess;
  let pv: Array<Move>;

  do {
    beta = f + (f === bound.lower ? 1 : 0);
    const result = negaMax(pos, depth, beta - 1, beta);
    f = result.score;
    pv = result.pv;

    if (f < beta) bound.upper = f;
    else bound.lower = f;
  } while (bound.lower < bound.upper - 0.01); // - 0.01 for floating point inaccuracy

  return { score: f, move: pv[0] };
}

export function aiMove(pos: Position): Move {

}
