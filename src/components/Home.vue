<template>
  <div>
    <div class="content">
      <Promotion v-if="promotion" :pos="promotion.pos" :board="$refs.board"
        :color="promotion.color" @done="handlePromotion">
      </Promotion>
      <div class="board-container" ref="boardContainer">
        <div id="board" ref="board" @click="cancel" touch-action="none">
        </div>
        <canvas
          v-if="thinking || winningEntry" ref="canvas" id="canvas"
          :height="$refs.boardContainer.offsetHeight"
          :width="$refs.boardContainer.offsetWidth"
        >
        </canvas>
        <div v-if="(thinking && $refs.canvas)" class="overlay">
          <p class="thinking-text" v-if="!winningEntry">Thinking...</p>
          <div v-if="!winningEntry" class="think-bar">
            <div
              :style="{ width: thinkProgress() + '%' }"
              class="think-bar-fill"
            ></div>
          </div>
          <p
            class="move-text winning-move-text"
            v-if="winningEntry"
            :style="{
              left: textX(winningEntry.pv[0]) + 'px',
              top: textY(winningEntry.pv[0]) + 'px'
            }"
          >
            Winning move<br>Score: {{winningEntry.score}}
          </p>
          <p
            v-else
            class="move-text"
            v-for="(move, index) in moves"
            :key="index"
            :style="{
              left: textX(move.move) + 'px',
              top: textY(move.move) + 'px'
            }"
          >
            {{move.score}}
          </p>
        </div>
      </div>


      <div class="info">
        <h1>Jackfish</h1>
        <h2>A chess engine in javascript.</h2>
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

          <!--
          <div class="mt-3">
            <h6>AI search time (s)</h6>
            <div class="mb-2"><input v-model="game.config.searchTime"></div>
            <button type="button" class="btn btn-outline-success" @click="setTime(2)">Easy</button>
            <button type="button" class="btn btn-outline-warning" @click="setTime(4)">Medium</button>
            <button type="button" class="btn btn-outline-danger"  @click="setTime(6)">Hard</button>
          </div>
          -->

          <!--
          <div class="mt-3">
            <h6>Fen of starting position.</h6>
            <div><input v-model="startPos" class="fen"></div>
            <button class="btn btn-dark" @click="setStartPos">Set position</button>
            <button class="btn btn-dark" @click="resetStartPos">Reset</button>
            <p v-if="invalidStartPos" class="text-danger">Invalid FEN string</p>
          </div>
          -->

          <!--
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
          -->

          <div class="mt-3">
            <p><strong>Depth searched:</strong> {{aiInfo.depth}}</p>
            <p><strong>Nodes searched:</strong> {{aiInfo.searched}}</p>
            <!--<p><strong>Hits in transposition table:</strong> {{aiInfo.tpHits}}</p>-->
          </div>
        </div>

        <div class="col-sm-6 links">
          <h3>About</h3>
          <p>
            This is a chess engine I've built in javascript.
            All rules apply: insufficient material, fifty-move rule, threefold
            repetition etc. More info below.
          </p>
          <a target="_blank" class="btn btn-primary btn-lg" href="https://github.com/mattiasahlsen/jackfish/" role="button">
            Github repo
          </a>
        </div>

    <div class="about mt-4 mb-4">
      <h4 class="mt-3">Features</h4>
      <ul>
        <li>
          <a href="https://chessprogramming.wikispaces.com/Simplified+evaluation+function">
            Piece-square table evaluation
          </a>
        </li>
        <li class="">
          <a href="https://chessprogramming.wikispaces.com/MTD%28f%29">
            MTD(f)
          </a>
        </li>
        <li class="">
          <a href="https://chessprogramming.wikispaces.com/Alpha-Beta">
            Alpha-beta
          </a>
        </li>
        <li class="">
          <a href="https://chessprogramming.wikispaces.com/Iterative+Deepening">
            Iterative deepening
          </a>
        </li>
        <li class="">
          <a href="https://chessprogramming.wikispaces.com/Transposition%20Table#KeyCollisions">
            Transposition table
          </a>
        </li>
        <li class="">
          <a href="https://chessprogramming.wikispaces.com/Quiescence+Search">
            Quiescence search
          </a>
        <li class="">
          <a href="https://chessprogramming.wikispaces.com/delta+pruning">
            Delta pruning
          </a>
        </li>
      </ul>

      <!--
      <h4 class="mt-3">To be implemented</h4>
      <ul class="">
        <li class="">
          <a href="https://chessprogramming.wikispaces.com/Killer+Move">
            Killer heuristic
          </a>
        </li>
        <li class="">
          <a href="https://chessprogramming.wikispaces.com/Pawn%20Structure">
            Pawn structure evaluation
          </a>
        </li>
      </ul>
      -->

      <h4 class="mt-3">Credits to</h4>
      <div>
        <a href="https://chessprogramming.wikispaces.com/">https://chessprogramming.wikispaces.com/</a>
      </div>
      <div>
        <a href="https://github.com/thomasahle/sunfish">https://github.com/thomasahle/sunfish</a>
      </div>
      <div>
      </div>
    </div>

    <p class="created-by">Created by Mattias Ahlsén</p>

    </div>

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
      aiInfo: game.aiInfo,

      fen: game.fen(),
      startPos: game.config.startPos,
      board: null,

      thinking: false,
      startedThinking: null,
      winningEntry: null,
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
      this.board.position(this.game.fen(), true);
      this.winner = this.game.winner();
      this.fen = this.game.fen();
    },
    'game.position.turn': function() {
      if (this.game.turn() === 'black' && this.game.winner() === null) {
        setTimeout(() => {
          this.thinking = true
          this.startedThinking = new Date()
          this.moves = Array.from(this.game.position.genMoves())
            .map(move => ({ move, }))
          this.game.aiMove(100, async entry => {
            this.winningEntry = entry
            const move = entry.pv
            const ctx = this.$refs.canvas.getContext('2d')
            //ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
            //ctx.stroke()
            this.$refs.canvas.width = this.$refs.canvas.width

            ctx.lineWidth = 6
            ctx.strokeStyle = '#00ff99'
            ctx.shadowOffsetX = 2
            ctx.shadowOffsetX = 2
            ctx.shadowBlur = 5
            ctx.shadowColor = 'rgba(0, 0, 0, 0.02)'
            this.drawLine(ctx, move[0][0], move[0][1])

            await new Promise((resolve, reject) => setTimeout(resolve, 1000))
            this.winningEntry = null
          }).finally(() => {
            this.thinking = false
            this.startedThinking = null
          })
        }, 100);
      }
    },

    'game.aiInfo': {
      handler: function(val) { this.aiInfo = val; }, deep: true
    }
  },
  mounted () {
    this.game.configure({
      betweenDepths: async (move, index, score, depth) => {
        const ctx = this.$refs.canvas.getContext('2d')
        ctx.lineWidth = 4
        ctx.strokeStyle = '#33cccc'
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetX = 2
        ctx.shadowBlur = 5
        ctx.shadowColor = 'rgba(0, 0, 0, 0.02)'

        this.drawLine(ctx, move[0], move[1])

        this.moves[index].score = score
        this.moves[index].depth = depth

        this.$forceUpdate()
        await new Promise((resolve, reject) => setTimeout(resolve, 10))
      },
    })

    this.onDragStart = (src, piece) => {
      return (piece.charAt(0) === 'w' ? WHITE : BLACK) ===
        this.game.position.turn && this.winner === null;
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
    window.onresize = this.createBoard

    this.$refs.board.ontouchmove = (event) => event.preventDefault()
  },
  methods: {
    drawLine(ctx, from, to) {
      const fromX = this.getX(from)
      const fromY = this.getY(from)
      ctx.moveTo(fromX, fromY)

      const toX = this.getX(to)
      const toY = this.getY(to)
      ctx.lineTo(toX, toY)
      ctx.stroke()
    },
    canvasWidth() {
      const canvas = this.$refs.canvas
      const width = canvas.offsetWidth
      return width
    },
    canvasHeight() {
      const canvas = this.$refs.canvas
      const height = canvas.offsetHeight
      return height
    },
    textX(move) {
      return (this.getX(move[0]) + this.getX(move[1])) / 2
    },
    textY(move) {
      return (this.getY(move[0]) + this.getY(move[1])) / 2
    },
    getX(pos) {
      return (pos % 8 + 1 / 2) / 8 * this.canvasWidth()
    },
    getY(pos) {
      return (Math.floor(pos / 8) + 1 / 2) / 8 * this.canvasHeight()
    },
    thinkProgress() {
      const progress = (new Date().getTime() - this.startedThinking.getTime()) / (this.game.config.searchTime * 1000)
      return progress * 100 // to percent
    },
    createBoard() {
      //console.log($(window).width() * 0.9)
      const windowHeight = $(window).height()
      const windowWidth = $(window).width()
      this.$refs.board.style.width = this.$refs.board.style.height =
        Math.min(windowWidth, windowHeight) + 'px'

      //console.log(this.game)
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
      console.log('restart')
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
.content {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
}
#board {
  touch-action: none;
  margin-left: auto;
  margin-right: auto;
  flex-grow: 0;
  flex-shrink: 0;
}
.info {
  width: 500px;
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
  width: 100%;
  background-color:
}
.created-by {
  display: inline-block;
  margin-right: 10px;
}

h1, h2 {
  margin: 0;
}

</style>
<style>
/* custom board colors */
.black-3c85d {
  background-color: #002233 !important;
}
.white-1e1d7 {
  background-color:#f2f2f2 !important;
}
.piece-417db {
  cursor: pointer;
}
.my-img {
  width: 200px;
  height: 200px;
}

/* cool thinking animations */
.board-container {
  position: relative;
  margin: 2px;
}
.overlay {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;

  background-color: rgba(0, 34, 51, 0.6)
  /*border: 2px solid #00ffff;*/
}
.think-bar {
  height: 20px;
  width: 50%;
  background-color: #595959;
  border-radius: 5px;
  -webkit-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
  box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
  position: relative;
  overflow: hidden;
}
.think-bar-fill {
  height: 100%;
  background-color: #0086b3;
  transition: width 0.5s linear;
}
#canvas {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
.move-text {
  position: absolute;
}
.winning-move-text {
  font-size: 24px;
}
.thinking-text {
  margin-bottom: 5px;
  margin-top: 0;
  margin-left: 0;
  margin-right: 0;
  padding: 0;
}
</style>
