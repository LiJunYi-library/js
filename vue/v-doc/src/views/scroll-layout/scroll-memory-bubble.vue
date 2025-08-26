<template>
  <div class="scroll-memory-bubble-demo">
    <r-scroll @scroll="scroll">
      <div>{{ text }}</div>
      <r-scroll-memory-bubble>
        <div class="bubble"></div>
      </r-scroll-memory-bubble>
      <div>{{ text }}</div>
    </r-scroll>
  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useRadio2 } from '@rainbow_ljy/v-hooks'
import { ref, onMounted } from 'vue'
import { promiseSetTimeout } from '@rainbow_ljy/rainbow-js'
const text = arrayLoopMap(300, () => '帅').join('')
</script>

<style lang="scss">
.scroll-memory-bubble-demo {
  font-size: 80px;
  .bubble {
    width: 50px;
    height: 50px;
    background: cyan;
  }
}
</style>
