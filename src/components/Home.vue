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

/* eslint-disable */ // import statements after non-import statements

// Images for the chess board are copied to /static/img
import Chessboard from 'chessboardjs';
import 'chessboardjs/www/css/chessboard.css';

import jackfish from '@/jackfish';

/* eslint-enable */

export default {
  name: 'Home',
  data () {
    return {
    };
  },

  mounted () {
    this.board = Chessboard('board', {
      position: 'start',
      draggable: true,
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
