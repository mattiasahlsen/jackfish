import { PIECE, pst, pstRaw } from '@/jackfish/evaluation';
import { parse } from '@/jackfish/helpers';
import Jackfish from '@/jackfish';

describe('pst', () => {
  const pieces = ['P', 'N', 'B', 'R', 'Q', 'K'];
  it('should be defined for both black and white pieces', () => {
    pieces.forEach(key => {
      const bKey = key.toLowerCase();
      expect(pst[key].length).toBe(64);
      expect(pst[bKey].length).toBe(64);
      // should be defined and truthy
      for (let i = 0; i < 64; i++) {
        expect(pst[key][i]).toBeTruthy();
        expect(pst[bKey][i]).toBeTruthy();
      }
    })
  });

  it('should be mirorred for black pieces', () => {
    pieces.forEach(key => {
      const bKey = key.toLowerCase();

      // black should be white mirrored
      expect(pst[key][0]).toBe(pst[bKey][56]);
      expect(pst[key][3]).toBe(pst[bKey][59]);
      expect(pst[key][5]).toBe(pst[bKey][61]);
      expect(pst[key][7]).toBe(pst[bKey][63]);
      expect(pst[key][9]).toBe(pst[bKey][49]);
      expect(pst[key][14]).toBe(pst[bKey][54]);
    });
  })

  it('should have correct values', () => {
    pieces.forEach(key => {
      expect(pst[key][5]).toBe(pstRaw[key][5] + PIECE[key]);
      expect(pst[key][47]).toBe(pstRaw[key][47] + PIECE[key]);
    })
  })
});

test('evaluation', () => {
  const game = new Jackfish();
  const pos = game.position;
  expect(pos.score).toBe(0);

  let move = [parse('e2'), parse('e4')]
  expect(pos.value(move)).toBeGreaterThan(0);
  expect(-(pos.score + pos.value(move))).toBe(pos.move(move).score);

  move = [parse('e7'), parse('e5')];
  expect(pos.value(move)).toBeGreaterThan(0);
})
