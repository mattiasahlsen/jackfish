/**
 * Benchmarks.
 */

require('babel-register');

import { Lru, Cwf, randoms } from '../src/jackfish/tp';

const Benchmark = require('benchmark');

const testAdd = new Benchmark.Suite();
const testGet = new Benchmark.Suite();

// helpers
function log(event) {
  console.log(String(event.target));
}

function init(Constr, size) {
  const cache = new Constr(size);
  const keys = [];
  for (let i = 0; i < size; i++) {
    keys.push(randoms());
    cache.add(keys[i], i);
  }
  return { cache, keys };
}

console.log('starting tests');

// test get
(() => {
  const lru100 = init(Lru, 100);
  const lru10000 = init(Lru, 10000);
  const cwf100 = init(Cwf, 100);
  const cwf10000 = init(Cwf, 10000);

  // co is cache object returned by init
  function testGetHelp (co, size) {
    co.cache.get(co.keys[0]);
    co.cache.get(co.keys[Math.floor(size / 2)]);
    co.cache.get(co.keys[size - 1]);
  }

  testGet.add('Lru get on 100', () => testGetHelp(lru100, 100))
    .add('Lru get on 10000', () => testGetHelp(lru10000, 10000))
    .add('Cwf get on 100', () => testGetHelp(cwf100, 100))
    .add('Cwf get on 10000', () => testGetHelp(cwf10000, 10000))
    .on('cycle', log);
})();

// test add
(() => {
  const fullLru = init(Lru, 1000).cache;
  const fullCwf = init(Cwf, 1000).cache;
  function testAddHelp(cache) {
    for (let i = 0; i < 100; i++) cache.add(randoms(), i);
  }
  testAdd.add('Lru add on empty', () => testAddHelp(new Cwf(100)))
    .add('Lru add on full', () => testAddHelp(fullLru))
    .add('Cwf add on empty', () => testAddHelp(new Cwf(100)))
    .add('Cwf add on full', () => testAddHelp(fullCwf))
    .on('cycle', log);
  testAdd.run();
})();
