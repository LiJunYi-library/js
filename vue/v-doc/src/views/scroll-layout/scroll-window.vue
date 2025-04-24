<template>
  <div class="scroll-refresh-demo">
    <r-scroll-window>
      <r-scroll-refresh slot="top" :onrefresh="onrefresh"></r-scroll-refresh>
      <r-scroll @scroll="scroll">
        <!-- <r-scroll-refresh :onrefresh="onrefresh"></r-scroll-refresh> -->
        <div style="height: 50px;"></div>
        <div class="flexed">123</div>
        <div>123</div>
        <div>123</div>
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
.scroll-refresh-demo {
  .flexed {
    position: fixed;
    top: 0;
    width: 100%;
    background: red;
    height: 50px;
  }
}
</style>
