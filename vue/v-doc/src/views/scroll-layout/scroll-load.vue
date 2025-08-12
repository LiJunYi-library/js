<template>
  <div class="scroll-load-demo">
    <r-scroll-window>
      <r-scroll-refresh slot="top" :onrefresh="onrefresh"></r-scroll-refresh>
      <r-scroll @scroll="scroll">
        <div style="font-size: 80px">{{ text }}</div>
      </r-scroll>
    </r-scroll-window>
  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { setTimeoutPromise } from '@rainbow_ljy/rainbow-js'

const text = arrayLoopMap(300, () => '帅').join('')

async function onrefresh() {
  return setTimeoutPromise(300000)
}
</script>

<style lang="scss">
.scroll-load-demo {
  r-scroll-refresh {
    background: chartreuse;
  }
}
</style>
