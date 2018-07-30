// @flow

import Engine from '@/jackfish';
import Position from '@/jackfish/Position';

test('genMoves', () => {
  const countMoves = (moves) => {
    let count = 0;
    let val = moves.next();
    while (!val.done) {
      count++;
      val = moves.next();
    }
    return count;
  }

  const game = new Engine();
  let moves = game.position.genMoves();

  expect(countMoves(moves)).toBe(20);

  game.setPos(
    'rnbqkbnr/1pp1pppp/8/3pP3/p1B5/5N2/PPPP1PPP/RNBQK2R w KQkq d6 0 5'
  );
  moves = game.position.genMoves();
  expect(countMoves(moves)).toBe(31);
});

test('move', () => {
  const equalBoards = (b1, b2) => {
    for (let i = 0; i < 64; i++) {
      if (b1[i] !== b2[i]) return false;
    }
    return true;
  }
  const equalPositions = (p1: Position, p2: Position) => {
    return equalBoards(p1.board, p2.board) && p1.turn === p2.turn &&
      p1.wc[0] === p2.wc[0] && p1.wc[1] === p2.wc[1] &&
      p1.bc[0] === p2.bc[0] && p1.bc[1] === p2.bc[1] &&
      p1.ep === p2.ep && p1.kp === p2.kp && p1.score === p2.score;
  }
  const unEqualRefs = (p1: Position, p2: Position) =>
    p1.board !== p2.board && p1.wc !== p2.wc && p1.bc !== p2.bc;

  let reference = new Engine();
  let game = new Engine();
  // does not change game.position, only returns a new position
  let newPos = game.position.move([52, 36]);

  // check that the original position is not manipulated
  expect(equalPositions(game.position, reference.position)).toBe(true);
  expect(unEqualRefs(game.position, newPos)).toBe(true);

  expect(newPos.board[52]).toBe(null);
  expect(newPos.board[36]).toBe('P');
  expect(newPos.ep).toBe(44);

  // test en passant
  reference.setPos('rnbqkbnr/1ppp1ppp/p7/3Pp3/8/8/PPP1PPPP/RNBQKBNR w KQkq e6 0 3');
  game.setPos('rnbqkbnr/1ppp1ppp/p7/3Pp3/8/8/PPP1PPPP/RNBQKBNR w KQkq e6 0 3');
  newPos = game.position.move([27, 20]);
  expect(equalPositions(game.position, reference.position)).toBe(true);
  expect(unEqualRefs(game.position, newPos)).toBe(true);
  expect(newPos.board[28]).toBe(null);

  // test castle
  reference.setPos(
    'r1bqkb1r/1pp2ppp/p1np1n2/3Pp3/2B1P3/5N2/PPP2PPP/RNBQK2R w KQkq - 3 6'
  );
  game.setPos(
    'r1bqkb1r/1pp2ppp/p1np1n2/3Pp3/2B1P3/5N2/PPP2PPP/RNBQK2R w KQkq - 3 6'
  );
  newPos = game.position.move([60, 62]);
  expect(equalPositions(game.position, reference.position)).toBe(true);
  expect(unEqualRefs(game.position, newPos)).toBe(true);
  expect(newPos.board[62]).toBe('K');
  expect(newPos.board[61]).toBe('R');
  expect(newPos.kp).toBe(61);
});
