<template>
  <div>
    <h1>Jackfish</h1>
    <h2>A simple and understandable chess engine.</h2>
    <div id="board"></div>
  </div>
</template>

<script>
import $ from 'jquery';
window.$ = window.jquery = $;

// Images for the chess board are copied to /static/img
import Chessboard from 'chessboardjs';
import 'chessboardjs/www/css/chessboard.css';

import Engine from '@/jackfish';
import { WHITE, BLACK } from '@/jackfish/declarations';

export default {
  name: 'Home',
  data () {
    return {
      game: new Engine(),
    };
  },

  mounted () {
    const onDragStart = (src, piece) =>
      (piece.charAt(0) === 'w' ? WHITE : BLACK) === this.game.position.turn;

    const onDrop = (src, target) => {
      if (!this.game.move(src, target)) return 'snapback';
      else (this.board.position(this.game.fen(), false));
    }
    this.board = Chessboard('board', {
      position: 'start',
      draggable: true,
      onDrop,
      onDragStart,
    });
  },
}
</script>

<style scoped>
#board {
  max-width: 60%;
  margin: auto;
  margin-bottom: 50px;
}
</style>
