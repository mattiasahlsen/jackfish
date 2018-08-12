// @flow

import Engine from '@/jackfish';
import Position from '@/jackfish/Position';
import { equalBoards, parse } from '@/jackfish/helpers';
import { WHITE, BLACK } from '@/jackfish/declarations'
import type { Piece } from '@/jackfish/declarations';

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

test('hashMove', () => {
  const game1 = new Engine();
  const game2 = new Engine();

  // test that move [o, t] in FEN position pos hashes correctly
  const checkMove = (pos: string, o: string, t: string, promo?: Piece) => {
    game1.setPos(pos);
    game2.setPos(pos);
    game2.move(parse(o), parse(t), promo);

    expect(game1.position.hash).not.toEqual(game2.position.hash);
    expect(game1.position.boardHash).not.toEqual(game2.position.boardHash);

    expect(game1.position.hashMove([parse(o), parse(t)], promo)[0])
      .toEqual(game2.position.hash);
    expect(game1.position.hashMove([parse(o), parse(t)], promo)[1])
      .toEqual(game2.position.boardHash);
  }

  // a normal move
  checkMove(game1.config.startPos, 'b1', 'c3');
  // pawn double move, new en passant square
  checkMove(game1.config.startPos, 'e2', 'e4');
  // new en passant square after an en passant square
  checkMove('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', 'e7', 'e5');
  // castle
  checkMove('r1bqkbnr/ppp2ppp/2np4/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4', 'e1', 'g1');
  // en passant take
  checkMove('r1bqkbnr/pppp1ppp/2n5/3Pp3/8/8/PPP1PPPP/RNBQKBNR w KQkq e6 0 3', 'd5', 'e6');
  // promotion without promo argument
  checkMove('r1bq1bnr/1pppkPpp/p1n5/8/8/8/PPP1PPPP/RNBQKBNR w KQ - 1 5', 'f7', 'g8');
  // promotion with promo argument
  checkMove('r1bq1bnr/1pppkPpp/p1n5/8/8/8/PPP1PPPP/RNBQKBNR w KQ - 1 5', 'f7', 'g8', 'N');
});

describe('check', () => {
  const game = new Engine();
  game.setPos('rnbqkbnr/ppp1pppp/8/1B1p4/4P3/8/PPPP1PPP/RNBQK1NR b KQkq - 1 2');
  expect(game.position.inCheck()).toBe(true);
  expect(game.position.inCheck(BLACK)).toBe(true);
  expect(game.position.inCheck(WHITE)).toBe(false);

  game.setPos('r1bqkbnr/pppppppp/8/3P4/8/5N2/PPn1PPPP/RNBQKB1R w KQkq - 0 4');
  expect(game.position.inCheck()).toBe(true);
  expect(game.position.inCheck(BLACK)).toBe(false);
  expect(game.position.inCheck(WHITE)).toBe(true);

  game.setPos('rnbqkbnr/ppppp1pp/8/5p1Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2');
  expect(game.position.inCheck()).toBe(true);
  expect(game.position.inCheck(BLACK)).toBe(true);
  expect(game.position.inCheck(WHITE)).toBe(false);

  game.setPos('rnbqkbnr/ppp2Ppp/8/3p4/8/8/PPPPP1PP/RNBQKBNR b KQkq - 0 4');
  debugger;
  expect(game.position.inCheck(1)).toBe(true);
  expect(game.position.inCheck(BLACK)).toBe(true);
  expect(game.position.inCheck(WHITE)).toBe(false);

  game.setPos('rnbq1bnr/pppp1ppp/4k3/4P3/4P3/8/PPP2PPP/RNBQKBNR w KQ - 1 4');
  expect(game.position.inCheck()).toBe(false);
  expect(game.position.inCheck(BLACK)).toBe(false);
  expect(game.position.inCheck(WHITE)).toBe(false);

  game.setPos('rnbq1bnr/pppp1ppp/4P3/5k2/8/8/PPP2PPP/RNBQKBNR b KQ - 0 7');
  expect(game.position.inCheck()).toBe(false);
  expect(game.position.inCheck(BLACK)).toBe(false);
  expect(game.position.inCheck(WHITE)).toBe(false);

  game.setPos('rnbqkbnr/ppp3pp/4p3/1N1p1p2/3P4/8/PPP1PPPP/R1BQKBNR w KQkq f6 0 4');
  expect(game.position.inCheck()).toBe(false);
  expect(game.position.inCheck(BLACK)).toBe(false);
  expect(game.position.inCheck(WHITE)).toBe(false);
})
