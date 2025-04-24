<template>
  <div class="scroll-refresh-demo">
    <r-scroll @scroll="scroll">
      <r-scroll-refresh :onrefresh="onrefresh" :refresh-type="refreshType">
        <div>4578965</div>
      </r-scroll-refresh>
      <div style="height: 50px;background: cyan;"></div>
      <select v-model="refreshType">
        <option value="" label="默认"></option>
        <option value="fixed" label="fixed"></option>
      </select>
      <div>123</div>
      <div style="font-size: 80px">{{ text }}</div>
    </r-scroll>
  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { setTimeoutPromise } from '@rainbow_ljy/rainbow-js'
import { ref } from 'vue'
const text = arrayLoopMap(300, () => '帅').join('')
const refreshType = ref("fixed");

async function onrefresh() {
  return setTimeoutPromise(3000)
}
</script>

<style lang="scss">
.scroll-refresh-demo {
  background: rgb(161, 249, 249);
}
</style>
