<template>
  <div class="promotion" :style="{
    left: offset + 'px',
    width: width + 'px',
  }">
    <img v-for="(img, piece) in urls" :key="img"
      :src="img" @click="$emit('done', piece)"
      :style="{ width: width + 'px', }"
    >
  </div>
</template>

<script>
import { WHITE } from '@/jackfish/declarations';

// piece img urls
const imgs = {
  white: {
    Q: 'wQ',
    N: 'wN',
    R: 'wR',
    B: 'wB',
  },
  black: {
    q: 'bQ',
    n: 'bN',
    r: 'bR',
    b: 'bB',
  }
};

for (const key in imgs.white) {
  import('../assets/img/chesspieces/wikipedia/' + imgs.white[key] + '.png').then(val => {
    imgs.white[key] = val;
  })
}
for (const key in imgs.black) {
  import('../assets/img/chesspieces/wikipedia/' + imgs.black[key] + '.png').then(val => {
    imgs.black[key] = val;
  })
}

export default {
  name: 'Promotion',
  data() {
    return {
    };
  },
  props: ['pos', 'color', 'board'],
  computed: {
    file() {
      return this.pos % 8; // 0 - 7
    },
    // piece img urls
    urls() {
      if (this.color === WHITE) return imgs.white;
      else return imgs.black;
    },
    width() {
      return this.board.offsetWidth / 8;
    },
    offset() {
      return this.board.getBoundingClientRect().x +
        (this.file - 1) * this.width;
    }
  },
};
</script>

<style scoped>
.promotion {
  position: absolute;
  background-color: white;
  box-shadow: 1px 1px 5px;
  z-index: 100;
}
</style>
