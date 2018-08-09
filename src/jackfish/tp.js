/**
 * Transposition table stuff
 * @flow
 */

import Position from './Position';
import { pieces, WHITE } from './declarations';
import type { Piece } from './declarations';

const Random = require('random-js');
// 27102 is just a random number
const random = new Random(Random.engines.mt19937().seed(27102));

/**
 * Zobrist hashing for positions. Hashed in two parts, low and high.
 *
 * Low is used as key in Map and high is stored at the key
 * together with a value for that position. This is because of
 * javascript's number type that can only store integers up to 52 signed
 * bits and the fact that bitwise operators in javascript only operates on
 * 32 bit signed integers.
 */

// get 2 random 32 bit integers
export function rand() {
  return random.integer(-Math.pow(2, 31), Math.pow(2, 31) - 1);
}

// Makes a hash tuple with low and high
export const randoms = () => [rand(), rand()];

// initialize hashes array
type Hashes = {
  [index: Piece | 'wc' | 'bc' | 'turn' | 'epFile' | 'kp']: any
}
const hashes: Hashes = {};
pieces.forEach(p => {
  hashes[p] = [];
  for (let i = 0; i < 64; i++) {
    hashes[p].push(randoms()); // [low, high]
  }

  hashes.turn = randoms(); // apply when white's turn

  hashes.wc = [randoms(), randoms()]; // [queenside, kingside]
  hashes.bc = [randoms(), randoms()];

  hashes.epFile = [];
  for (let i = 0; i < 8; i++) {
    hashes.epFile.push(randoms()); // [A, B, C...]
  }

  hashes.kp = [];
  const kps = [3, 5, 59, 61];
  for (let i = 0; i < kps.length; i++) {
    hashes.kp[kps[i]] = randoms();
  }
});

export { hashes };

// Hash the position, returning hash as [low, high]
export function hash(pos: Position): [number, number] {
  const myHash = [0, 0]; // low, high

  // apply [low, high] to low and high
  const applyHashes = (hashParam: [number, number]) => {
    myHash[0] ^= hashParam[0];
    myHash[1] ^= hashParam[1];
  }

  if (pos.turn === WHITE) applyHashes(hashes.turn);
  for (let i = 0; i < 64; i++) {
    const p = pos.board[i];
    if (p) applyHashes(hashes[p][i]);
  }
  if (pos.wc[0]) applyHashes(hashes.wc[0]);
  if (pos.wc[1]) applyHashes(hashes.wc[1]);
  if (pos.bc[0]) applyHashes(hashes.bc[0]);
  if (pos.bc[1]) applyHashes(hashes.bc[1]);
  if (pos.ep !== -1) applyHashes(hashes.epFile[pos.ep % 8]);
  if (pos.kp !== -1) applyHashes(hashes.kp[pos.kp]);

  return myHash;
}

/** Transposition table */

// LRU cache, first in first out, size > 0
export class Lru<Entry = any> {
  map: Map<number, Array<Entry>> = new Map();
  // max number of keys in map (not max number of entries since there can be
  // many entries in an array at one key)
  maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  size() {
    return this.map.size;
  }

  /** Returns entry at hash, or undefined if there is none. */
  get(hash: [number, number]): ?Entry {
    const low = hash[0];
    const high = hash[1];
    const arr = this.map.get(low);

    if (arr !== undefined) {
      // set to last recently used
      this.map.delete(low);
      this.map.set(low, arr);

      return arr[high];
    }
    return undefined;
  }

  /** Add an entry to the cache, returns the added entry. */
  add(hash: [number, number], val: Entry): Entry {
    const low = hash[0];
    const high = hash[1];
    const arr = this.map.get(low);

    if (arr !== undefined) {
      arr[high] = val;
      this.map.delete(low);
      this.map.set(low, arr);
    } else {
      const arr = [];
      arr[high] = val;
      this.map.set(low, arr);
    }

    if (this.map.size > this.maxSize) {
      // $FlowFixMe
      this.map.delete(this.map.keys().next().value);
    }

    return val;
  }

  clear() {
    this.map.clear();
  }

  setSize(maxSize: number) {
    this.maxSize = maxSize;
  }
}

// A simpler clear-when-full cache,
// has a max size but just resets when it's reached
export class Cwf<Entry = any> {
  cache: Array<Array<Entry>> = [];
  maxSize: number;
  currentSize: number = 0;

  constructor(size: number) {
    this.maxSize = size;
  }

  size(): number {
    return this.currentSize;
  }
  setSize(size: number): void {
    this.maxSize = size;
  }

  /** Returns entry at hash or undefined if there is none. */
  get(hash: [number, number]): ?Entry {
    const low = hash[0];
    const high = hash[1];

    if (this.cache[low] !== undefined) return this.cache[low][high];
    else return undefined;
  }

  /** Add an entry to the cache. Assumes it does not already exist */
  add(hash: [number, number], val: Entry): Entry {
    const low = hash[0];
    const high = hash[1];

    // if passed size limit, clear cache and start over
    // (might clear one too early)
    if (this.currentSize === this.maxSize) {
      this.cache = [];
      this.currentSize = 0;
    }

    if (this.cache[low] !== undefined) {
      if (this.cache[low][high] === undefined) this.currentSize++;
      this.cache[low][high] = val;
    } else {
      this.cache[low] = [];
      this.cache[low][high] = val;
      this.currentSize++;
    }
    return val;
  }
  clear() {
    this.cache = [];
    this.currentSize = 0;
  }
}
