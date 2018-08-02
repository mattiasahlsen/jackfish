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

// test that end of game works correctly
describe('winner()', () => {
  const game = new Engine();

  test('stalemate', () => {
    game.setPos('8/6b1/8/8/8/n7/PP6/K7 w - - 0 1');
    expect(game.inStaleMate()).toBe(true);
    expect(game.winner()).toBe('draw');
  });

  test('fiftyMoveRule', () => {
    game.setPos(
      'r1bqkbnr/pppp1ppp/2n5/4p3/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 50 49'
    );
    expect(game.fiftyMoves()).toBe(true);
    expect(game.winner()).toBe('draw');
    game.setPos(
      'r1bqkbnr/pppp1ppp/2n5/4p3/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 52 51'
    );
    expect(game.fiftyMoves()).toBe(true);
    expect(game.winner()).toBe('draw');
  });

  test('threefoldRepetition', () => {
    game.restart();
    expect(game.fen()).toBe(startingPosition); // throw that in there

    expect(game.move('e2', 'e4')).toBe(true);
    expect(game.move('e7', 'e5')).toBe(true);

    const repeat = () => {
      expect(game.move('b1', 'c3')).toBe(true);
      expect(game.move('b8', 'c6')).toBe(true);
      expect(game.move('c3', 'b1')).toBe(true);
      expect(game.move('c6', 'b8')).toBe(true);
    };
    repeat(); // now been that the same position twice
    repeat(); // now three times

    expect(game.inThreefoldRepetition()).toBe(true);
    expect(game.winner()).toBe('draw');
  });
});

describe('move, moves, and valid', () => {
  const game = new Engine();

  test('move and valid', () => {
    // just a random invalid move with no piece on origin square
    expect(game.valid('c5', 'c6')).toBe(false);
    expect(game.move('c5', 'c6')).toBe(false);

    expect(game.valid('e2', 'e4')).toBe(true);
    // the promotion piece shouldn't matter
    expect(game.move('e2', 'e4', 'Q')).toBe(true);

    expect(game.valid('c2', 'c4')).toBe(false); // wrong turn
    expect(game.move('c2', 'c4')).toBe(false); // wrong turn

    expect(game.move('a8', 'a6')).toBe(false);
    expect(game.move('b8', 'c6')).toBe(true);

    // pawn promotion
    game.setPos('rnbqkbnr/pP3ppp/4p3/3p4/8/8/PPP1PPPP/RNBQKBNR w KQkq - 0 5');
    expect(game.move('b7', 'a8')).toBe(true); // default promotion to queen

    game.setPos('rnbqkbnr/pP3ppp/4p3/3p4/8/8/PPP1PPPP/RNBQKBNR w KQkq - 0 5');
    expect(game.move('b7', 'a8', 'N')).toBe(true);

    game.setPos('rnbqkbnr/pP3ppp/4p3/3p4/8/8/PPP1PPPP/RNBQKBNR w KQkq - 0 5');
    // wrong color of promotion piece
    expect(game.move('b7', 'a8', 'n')).toBe(false);

    game.setPos('rnbqkbnr/pP3ppp/4p3/3p4/8/8/PPP1PPPP/RNBQKBNR w KQkq - 0 5');
    // invalid promotion piece
    expect(game.move('b7', 'a8', 'K')).toBe(false);
  });

  test('moves', () => {
    game.restart();
    expect(game.moves().length).toBe(20); // very simple test...
  });
});
