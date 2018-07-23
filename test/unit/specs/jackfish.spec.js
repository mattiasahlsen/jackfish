// @flow
import Engine from '@/jackfish';
import { checkPieces, checkCastling, startingProps } from './helpers';
import Position from '@/jackfish/Position';

declare var describe;
declare var test;
declare var expect;
declare var toBe;

describe('setPos', () => {
  // object factory for starting position props of Position object
  // (not including all pieces)

  const testPos = (position: Position, props) => {
    expect(checkPieces(position, props.pieces)).toBe(true);
    expect(checkCastling(position, props.wc, props.bc)).toBe(true);
    for (const key in props) {
      if (key !== 'pieces' && key !== 'wc' && key !== 'bc') {
        expect((position: any)[key]).toBe(props[key]);
      }
    }
  }

  // some invalid FEN strings to test
  const invalid = [
    ['rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', true],
    ['rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2', true],
    ['rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', true],
    ['rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b - e6 5 29', true],
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
    expect(game.setPos(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')).toBe(true);

    const props = startingProps();
    testPos(game.position, props);
  })

  test('other FEN strings', () => {
    const game = new Engine();
    invalid.forEach(e => {
      expect(game.setPos(e[0])).toBe(e[1]);
    });
  });
});
