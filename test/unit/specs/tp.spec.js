/**
 * Test transposition tables and zobrist hashing.
 * @flow
 */

import Engine from '@/jackfish';
import { rand, hashes, hash, Cache, LRU, make } from '@/jackfish/tp';

describe('hashing', () => {
  // helper
  const max32bit = (num: number) => {
    expect(num).toBeLessThan(Math.pow(2, 31));
    expect(num).toBeGreaterThan(-Math.pow(2, 31) - 1);
  };
  const checkBoth = (lowAndHigh: [number, number]) => {
    max32bit(lowAndHigh[0]);
    max32bit(lowAndHigh[1]);
  }

  test('rand', () => {
    for (let i = 0; i < 50; i++) {
      max32bit(rand());
    }

    const r1 = rand();
    const r2 = rand();
    // XORing with the same number two times should leave a number unchanged
    expect(r1).toBe((r1 ^ r2) ^ r2);
  });

  test('hashes', () => {
    for (const key in hashes) {
      hashes[key].forEach((e) => checkBoth(e));
    }
  });

  test('hash()', () => {
    const game = new Engine();
    const h = hash(game.position);
    checkBoth(h);
  })
});

describe('caches', () => {
  test('simple cache', () => {
    const cache = new Cache(5);
    for (let i = 1; i <= 5; i++) {
      const hash = make();
      cache.add(hash, i);
      expect(cache.get(hash)).toBe(i);
      expect(cache.size()).toBe(i);
    }
    const hash = make();
    cache.add(hash, 10);
    expect(cache.size()).toBe(1);
    expect(cache.get(hash)).toBe(10);
  });

  test('LRU', () => {
    const cache = new LRU(5);
    const hashes = [];
    for (let i = 1; i <= 5; i++) {
      const hash = make();
      hashes.push(hash);
      cache.add(hash, i);
      expect(cache.get(hash)).toBe(i);
      expect(cache.size()).toBe(i);
    }
    for (let i = 6; i <= 10; i++) {
      const hash = make();
      hashes.push(hash);
      cache.add(hash, 7);
    }

    expect(cache.size()).toBe(5);
    for (let i = 0; i < 5; i++) expect(cache.get(hashes[i])).toBe(undefined);
    for (let i = 5; i < 10; i++) expect(cache.get(hashes[i])).toBe(7);
  });
});
