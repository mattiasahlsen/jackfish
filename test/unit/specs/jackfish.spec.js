// @flow
import Engine from '@/jackfish';
import { checkPieces, checkCastling, startingProps,
  startingPosition, openings } from './helpers';
import Position from '@/jackfish/Position';

describe('setPos', () => {
  // object factory for starting position props of Position object
  // (not including all pieces)

  const testState = (game: Engine, props) => {
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

  // some random FEN strings to test
  const fens = [
    ['rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', true],
    ['rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b Kkq - 1 2', true],
    ['rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b - e6 5 29', true],
    ['rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b - g3 5 29', true],
    ['rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b - - 5 29', true],

    ['rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQq f5 5 29', false],
    ['rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQq a4 5 29', false],
    ['rnbqkbnrr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', false],
    ['rnbqkbnr/pppppppp1/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', false],
    ['rnbqkbnr/ppppplppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', false],
    ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR s KQkq - 0 1', false],
    ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR - KQkq - 0 1', false],
    ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR KQkq - 0 1', false],
    ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq 10 -1 1', false],
    ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0', false],
    ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0', false],
    ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KKkq - 0 1', false],
    ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/5BBB w KQkq - 0 1', false],
    ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1', false],
    ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQka - 0 1', false],
    ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq 0 1', false],
    ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq i5 0 1', false],
    ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq a 0 1', false],
    ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq 42 0 1', false],
    ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq 4 0 1', false],
  ];

  test('starting pos', () => {
    const game = new Engine();
    expect(game.setPos(startingPosition)).toBe(true);

    const props = startingProps();
    testState(game, props);
    expect(props.halfMoveClock).toBe(game.halfMoveClock);
  })

  test('other FEN strings', () => {
    const game = new Engine();
    fens.forEach(e => {
      expect(game.setPos(e[0])).toBe(e[1]);
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
