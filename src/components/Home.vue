<template>
  <div>
    <h1>Jackfish</h1>
    <h2>A chess engine in javascript.</h2>
    <div class="game-status">
      <h3 v-if="winner === 'white'">The winner is
        <span class="white">white</span></h3>
      <h3 v-else-if="winner === 'black'">The winner is
        <span class="black">black</span></h3>
      <h3 v-else-if="winner === 'draw'">It's a draw</h3>
      <h3 v-else :style="{ visibility: 'hidden' }">
        Game is still running.
      </h3>

      <button type="button" class="btn btn-light" @click="undoMove">
        Undo move
      </button>
    </div>

    <Promotion v-if="promotion" :pos="promotion.pos" :board="$refs.board"
      :color="promotion.color" @done="handlePromotion">
    </Promotion>
    <div id="board" ref="board" @click="cancel">
    </div>
  </div>
</template>

<script>
import Promotion from './Promotion';

// Images for the chess board are copied to /static/img
import Chessboard from 'chessboardjs';
import 'chessboardjs/www/css/chessboard.css';

import Engine from '@/jackfish';
import { WHITE, BLACK } from '@/jackfish/declarations';
import { rank, parse } from '@/jackfish/helpers';

const game = new Engine();

export default {
  name: 'Home',
  components: {
    Promotion,
  },

  data () {
    return {
      game: game,
      promotion: null,
      winner: game.winner(),
    };
  },
  watch: {
    'game.position.board': function() {
      this.board.position(this.game.fen(), false);
      this.winner = this.game.winner();
    },
    'game.position.turn': function() {
      if (this.game.position.turn === BLACK && this.game.winner() === null) {
        setTimeout(() => this.game.aiMove(), 100);
      }
    }
  },
  mounted () {
    const onDragStart = (src, piece) => {
      return (piece.charAt(0) === 'w' ? WHITE : BLACK) === this.game.position.turn &&
      this.winner === null;
    }

    const onDrop = (src, target, piece) => {
      if (!this.game.valid(src, target)) return 'snapback';

      // pawn promotion
      const r = rank(parse(target));
      if (piece.charAt(1) === 'P' && (r === 8 || r === 1)) {
        const color = (piece.charAt(0) === 'w') ? WHITE : BLACK;
        // this refers to the vue object
        this.promotion = {
          pos: parse(target),
          color,
          src,
          target,
        };
        return;
      }

      this.game.move(src, target); // we already know it's valid
    }

    this.board = Chessboard('board', {
      position: this.game.fen(),
      draggable: true,
      onDrop,
      onDragStart,
    });
  },
  methods: {
    handlePromotion(piece) {
      this.game.move(
        this.promotion.src,
        this.promotion.target,
        piece
      );
      this.promotion = null;
    },
    cancel() {
      // cancel pawn promotion primarily
      this.promotion = null;
      this.board.position(this.game.fen(), false);
    },
    undoMove() {
      this.game.undoMove();
      if (game.position.turn === BLACK) this.game.undoMove();
    },
  },
}
</script>

<style scoped>
#board {
  width: 50%;
  margin: auto;
  margin-bottom: 50px;
  display: inline-block;
  float: left;
}
.game-status {
  float: left;
  width: 25%;
}
.game-status h3 {
  color: #737373;
}
.white {
  color: #a6a6a6;
}
.black {
  color: #333333;
}
</style>
