# jackfish
> A javascript chess engine.

## How to open on localhost
    git clone https://github.com/mattiasahlsen/jackfish.git
    cd jackfish
    npm install
    npm run dev

## Most relevant files
### /src/components/Home.vue
The UI.
### /src/jackfish/AI.js
The "AI", i.e. move solver.
### /src/jackfish/evaluation.js
Board evaluation.
### /src/jackfish/index.js
The game engine, separate from the move solver.
### /src/jackfish/Position.js
The board position class, holding the state of the game (piece positions,
castling rights, en passant etc).
### /src/jackfish/tp.js
Transposition table classes. Implements both an LRU cache using
the es6 [map class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and custom "CWF" cache (clear when full) that will just clear the
transposition table when full.

Currently only using the CWF cache, because it's much more efficient in the
current implementation since we will clear the tp (transposition table) between depths
(the majority of the positions saved in the tp will be irrelevant after the
move) and the max size of the tp is set to 10^7 (max a few hundred MB). Since we usually search
less than 200 000 nodes the tp will never be full on a normal
computer, so we don't need an LRU and the CWF cache will be much faster,
proved by the benchmarks in /test/benchmarks.js.

For the keys in the transposition table, we use [zobrist hashing](https://en.wikipedia.org/wiki/Zobrist_hashing), which was a bit of a challenge to implement in javascript
because of the number type. To achieve low enough collision rate (low
enough to make the risk of collision practically non-existing) I used
two numbers for every key (hash of the board position).

## Libraries and tools used
[chessboardjs](http://chessboardjs.com/)<br/>
[Vue webpack template](https://github.com/vuejs-templates/webpack)<br/>
[Bootstrap](https://getbootstrap.com/) (clearly... this project is not focused on visual uniqueness)

## Testing and benchmarks
I used [jest](https://jestjs.io/) for testing and [benchmark.js](https://www.npmjs.com/package/benchmark) for benchmarks. I tested most of the project and benchmarked only
the caches used for the transposition tables. Found in /src/test.
