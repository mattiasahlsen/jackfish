import Engine from '@/jackfish';

// search at fixed depth to make it consistent
const game = new Engine({searchTime: 10});

// https://www.chess.com/forum/view/daily-puzzles/8-5-2018-securing-the-promotion-1
test('Securing the promotion', async () => {
  expect.assertions(3);
  expect(game.setPos('5k2/8/7P/8/5K2/8/4B3/8 w - - 0 1')).toBe(true);
  const returned = await game.aiMove(5);
  expect(returned[2]).toBe('depth');
  expect(returned[0]).toEqual([52, 34]);
});

// https://www.chess.com/forum/view/daily-puzzles/8-7-2018-mysterious-landing-square
// This one revealed a bug that took very long time to find.
test('Mysterious landing square', async () => {
  expect.assertions(3)
  expect(game.setPos('4r1k1/p1p2pp1/1pq4p/8/2PPR2P/1P3Q2/P5P1/6K1 w - - 0 1'))
    .toBe(true);
  const returned = await game.aiMove(5);
  expect(returned[2]).toBe('depth');
  expect(returned[0]).toEqual([36, 12]);
});
