// @flow
import Engine from '@/jackfish';
import { checkPieces, checkCastling, startingProps,
  startingPosition, openings } from './helpers';
import Position from '@/jackfish/Position';

function testState (game: Engine, props): void {
  const position: Position = game.position;
  // might still be more pieces on board and this test will still pass
  expect(checkPieces(position, props.pieces)).toBe(true);
  expect(checkCastling(position, props.wc, props.bc)).toBe(true);
  expect(position.turn).toBe(props.turn);
  expect(position.ep).toBe(props.ep);
  expect(position.kp).toBe(props.kp);

  expect(game.halfMoveClock).toBe(props.halfMoveClock);
  expect(game.fullMove).toBe(props.fullMove);
}

// some random FEN strings for testing
const fens = {
  valid: [
    'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
    'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b Kkq - 1 2',
    'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b - e6 5 29',
    'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b - g3 5 29',
    'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b - - 5 29',
  ],
  invalid: [
    'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQq f5 5 29',
    'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQq a4 5 29',
    'rnbqkbnrr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    'rnbqkbnr/pppppppp1/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    'rnbqkbnr/ppppplppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR s KQkq - 0 1',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR - KQkq - 0 1',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR KQkq - 0 1',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq 10 -1 1',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KKkq - 0 1',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/5BBB w KQkq - 0 1',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQka - 0 1',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq 0 1',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq i5 0 1',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq a 0 1',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq 42 0 1',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq 4 0 1',
  ]
};

describe('setPos', () => {
  test('starting pos', () => {
    const game = new Engine();
    expect(game.setPos(startingPosition)).toBe(true);

    const props = startingProps();
    testState(game, props);
    expect(props.halfMoveClock).toBe(game.halfMoveClock);
  })

  test('other FEN strings', () => {
    const game = new Engine();
    fens.valid.forEach(e => {
      expect(game.setPos(e)).toBe(true);
    });
    fens.invalid.forEach(e => {
      expect(game.setPos(e)).toBe(false);
    });
  });

  test('en passant', () => {
    const game = new Engine();
    game.setPos(
      'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b - e6 5 29'
    );
    expect(game.position.ep).toBe(20);
  })

  test('openings', () => {
    const game = new Engine();
    openings.forEach(opening => {
      opening.forEach(position => {
        expect(game.setPos(position)).toBe(true);
      })
    });
  });
});

test('fen', () => {
  const game = new Engine();
  // check that fen of starting position is correct
  expect(game.fen()).toBe(startingPosition);
  fens.valid.forEach(e => {
    game.setPos(e);
    expect(game.fen()).toBe(e);
  })
})
