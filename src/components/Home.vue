<template>
  <div>
    <header id="header">
      <h1>Jackfish</h1>
      <h2>A chess engine in javascript.</h2>
    </header>
    <div class="container-fluid">
      <Promotion v-if="promotion" :pos="promotion.pos" :board="$refs.board"
        :color="promotion.color" @done="handlePromotion">
      </Promotion>
      <div id="board" ref="board" @click="cancel" touch-action="none">
      </div>

      <div class="row">
        <div class="game-status col-sm-6">
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
          <button type="button" class="btn btn-light" @click="restart">
            Restart
          </button>

          <div class="mt-3">
            <h6>AI search time (s)</h6>
            <div class="mb-2"><input v-model="game.config.searchTime"></div>
            <button type="button" class="btn btn-outline-success" @click="setTime(2)">Easy</button>
            <button type="button" class="btn btn-outline-warning" @click="setTime(4)">Medium</button>
            <button type="button" class="btn btn-outline-danger"  @click="setTime(6)">Hard</button>
          </div>

          <div class="mt-3">
            <h6>Fen of starting position.</h6>
            <div><input v-model="startPos" class="fen"></div>
            <button class="btn btn-dark" @click="setStartPos">Set position</button>
            <button class="btn btn-dark" @click="resetStartPos">Reset</button>
            <p v-if="invalidStartPos" class="text-danger">Invalid FEN string</p>
          </div>

          <div class="mt-3">
            <h6>
              <a href="https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation">
                FEN
              </a> of board
            </h6>
            <div><input v-model="fen" class="fen"></div>
            <button class="btn btn-dark" @click="setPos">Set position</button>
            <p v-if="invalidFen" class="text-danger">Invalid FEN string</p>
          </div>

          <div class="mt-3">
            <p><strong>Depth:</strong> {{aiInfo.depth}}</p>
            <p><strong>Nodes searched:</strong> {{aiInfo.searched}}</p>
            <p><strong>Hits in transposition table:</strong> {{aiInfo.tpHits}}</p>
          </div>
        </div>

        <div class="col-sm-6 links">
          <h3>About</h3>
          <p>
            This is a chess engine I've built in javascript. The "AI" uses
            <a href="https://chessprogramming.wikispaces.com/MTD%28f%29">mtd(f)</a>.
            All rules apply: insufficient material, fifty-move rule, threefold
            repetition etc, and the AI recognizes all these as draws and evaluates
            them accordingly. See more below.
          </p>
          <a class="btn btn-primary btn-lg" href="https://github.com/mattiasahlsen/jackfish/" role="button">
            Github repo
          </a>
        </div>
      </div>
    </div>

    <div class="about mt-4 mb-4">
      <h4 class="mt-3">Features</h4>
      <ul class="list-group">
        <li class="list-group-item">
          <a href="https://chessprogramming.wikispaces.com/Simplified+evaluation+function">
            Piece-square table evaluation
          </a>
        </li>
        <li class="list-group-item">
          <a href="https://chessprogramming.wikispaces.com/MTD%28f%29">
            MTD(f)
          </a>
        </li>
        <li class="list-group-item">
          <a href="https://chessprogramming.wikispaces.com/Alpha-Beta">
            Alpha-beta
          </a>
        </li>
        <li class="list-group-item">
          <a href="https://chessprogramming.wikispaces.com/Iterative+Deepening">
            Iterative deepening
          </a>
        </li>
        <li class="list-group-item">
          <a href="https://chessprogramming.wikispaces.com/Transposition%20Table#KeyCollisions">
            Transposition table
          </a>
        </li>
        <li class="list-group-item">
          <a href="https://chessprogramming.wikispaces.com/Quiescence+Search">
            Quiescence search
          </a>
        <li class="list-group-item">
          <a href="https://chessprogramming.wikispaces.com/delta+pruning">
            Delta pruning
          </a>
        </li>
      </ul>

      <h4 class="mt-3">To be implemented</h4>
      <ul class="list-group">
        <li class="list-group-item">
          <a href="https://chessprogramming.wikispaces.com/Killer+Move">
            Killer heuristic
          </a>
        </li>
        <li class="list-group-item">
          <a href="https://chessprogramming.wikispaces.com/Pawn%20Structure">
            Pawn structure evaluation
          </a>
        </li>
      </ul>

      <h4 class="mt-3">Credits to</h4>
      <a href="https://chessprogramming.wikispaces.com/">https://chessprogramming.wikispaces.com/</a>
      <br>
      <a href="https://github.com/thomasahle/sunfish">https://github.com/thomasahle/sunfish</a>
    </div>
    <p class="created-by">Created by Mattias Ahlsén</p>
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
      aiInfo: game.aiInfo,

      fen: game.fen(),
      startPos: game.config.startPos,
      board: null,
    };
  },
  computed: {
    invalidFen() {
      return !game.validFen(this.fen);
    },
    invalidStartPos() {
      return !game.validFen(this.startPos);
    },
  },
  watch: {
    'game.position.board': function() {
      this.board.position(this.game.fen(), false);
      this.winner = this.game.winner();
      this.fen = this.game.fen();
    },
    'game.position.turn': function() {
      if (this.game.turn() === 'black' && this.game.winner() === null) {
        setTimeout(() => this.game.aiMove(5000), 100);
      }
    },

    'game.aiInfo': {
      handler: function(val) { this.aiInfo = val; }, deep: true
    }
  },
  mounted () {
    this.game.configure({
      betweenDepths: () => {
        // nothing else works to force a re-render... Vue seems to be bugged.
        return new Promise(resolve => setTimeout(resolve, 10));
      },
    })

    this.onDragStart = (src, piece) => {
      return (piece.charAt(0) === 'w' ? WHITE : BLACK) === this.game.position.turn &&
      this.winner === null;
    }

    this.onDrop = (src, target, piece) => {
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
    this.createBoard()
    this.$refs.board.ontouchmove = (event) => event.preventDefault()
  },
  methods: {
    createBoard() {
      console.log($(window).width() * 0.9)
      this.$refs.board.style.width = this.$refs.board.style.height =
        Math.min($(window).height() - $('#header').height() - 15, $(window).width() * 0.8) + 'px'
      this.$refs.board.style.marginLeft = 'auto'
      this.$refs.board.style.marginRight = 'auto'

      this.board = Chessboard('board', {
        position: this.game.fen(),
        draggable: true,
        onDrop: this.onDrop,
        onDragStart: this.onDragStart,
      });
    },
    destroyBoard() {
      if (this.board) this.board.destroy()
      this.board = null
    },
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
    restart() {
      this.game.restart();
    },

    setPos() {
      if (this.game.setPos(this.fen)) this.fen = this.game.fen();
    },
    setStartPos() {
      if (game.validFen(this.startPos)) {
        this.game.configure({
          startPos: this.startPos
        });
      }
    },
    resetStartPos() {
      this.game.configure({
        startPos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      });
      this.startPos = this.game.config.startPos;
    },
    setTime(time) {
      this.game.configure({
        searchTime: time,
      });
    }
  },
}
</script>

<style scoped>
#board {
  width: 50%;
  height: 100vh;
  margin-bottom: 50px;
  touch-action: none;
}
.row {
  width: 100%;
  margin: 0 auto;
}
.game-status {
  margin-left: auto;
  margin-right: auto;
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

.fen {
  width: 90%;
  margin-bottom: 10px;
}

.links {
  padding: 5px;
  margin-left: auto;
  margin-right: auto;
}

.about {
  padding: 5px;
  float: left;
  width: 100%;
}
.created-by {
  display: inline-block;
  float: right;
  margin-right: 10px;
}

#header {
  margin-bottom: 5px;
}
h1, h2 {
  margin: 0;
}
</style>
