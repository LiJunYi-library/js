<template>
  <div class="scroll-sticky-demo">
    <r-scroll @scroll="scroll">
      <!-- <div v-if="bool">{{ text }}</div>
      <button @click="bool=!bool">bool</button> -->
      <div class="long-content"></div>
      <r-scroll-sticky class="g-scroll-sticky"> </r-scroll-sticky>
      <div class="long-content"></div>
      <div class="long-content">
        <r-scroll-sticky class="my-scroll-sticky"> 123456 </r-scroll-sticky>
      </div>
      <div>{{ text }}</div>
    </r-scroll>
  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useRadio2 } from '@rainbow_ljy/v-hooks'
import { ref, onMounted } from 'vue'
import { setTimeoutPromise } from '@rainbow_ljy/rainbow-js'

const text = arrayLoopMap(300, () => '帅').join('')

const bool = ref(true)

function scroll(events) {
  // console.log(events);
}
</script>

<style lang="scss">
.scroll-sticky-demo {
  font-size: 50px;

  .long-content {
    background: linear-gradient(yellow, cyan);
    height: 1000px;
  }

  .g-scroll-sticky {
    height: 80px;
    top: 0px;
    z-index: 3;
    --r-active-top: 1300px;
    font-size: 15px;

    &::before {
      content: '默认的样式';
    }

    &[css-name~='r-scroll-sticky-top-sticky'] {
      background: rgb(255, 196, 0);

      &::before {
        content: '吸附时的样式';
      }
    }

    &[css-name~='r-scroll-sticky-top-act'] {
      background: rgb(204, 255, 0);

      &::before {
        content: '滚动超过1300时的样式';
      }
    }
  }

  .b-scroll-sticky {
    height: 80px;
    bottom: 10px;
    z-index: 3;
    --r-active-bottom: 1300px;
    --r-opacity-bottom: 1000px;
    --r-opacity-sequence: reverse;
    font-size: 15px;
    background-color: aquamarine;

    &::before {
      content: '默认的样式';
    }

    &[css-name~='r-scroll-sticky-top-sticky'] {
      background: rgb(255, 196, 0);

      &::before {
        content: '吸附时的样式';
      }
    }

    &[css-name~='r-scroll-sticky-top-act'] {
      background: rgb(204, 255, 0);

      &::before {
        content: '滚动超过1300时的样式';
      }
    }
  }

  .my-scroll-sticky {
    top: 80px;
    height: 70px;
    font-size: 15px;
    background: rgb(255, 255, 255);

    &::before {
      content: '默认的样式';
    }

    &[css-name~='r-scroll-sticky-top-sticky'] {
      background: red;

      &::before {
        content: '吸附时的样式';
      }
    }


    &[css-name~='r-scroll-sticky-top-unbottom'] {
      background: rgb(178, 175, 175);

      &::before {
        content: '吸附结束时的样式';
      }
    }
  }
}
</style>
