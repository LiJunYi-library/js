<template>
  <r-scroll class="scroll-page-demo">
    <r-scroll-sticky style="top: 0;" class="sticky">
      <span>v: {{ value }}</span>
      <span @click="value = '1'">v1 </span>
      <span @click="value = '2'">v2 </span>
    </r-scroll-sticky>
    <r-scroll-page v-model="value">
      <r-scroll-page-item value="1">
        <div class="scroll-page-item">{{ text }}</div>
      </r-scroll-page-item>
      <r-scroll-page-item value="2">
        <div class="scroll-page-item">{{ text2 }}</div>
      </r-scroll-page-item>
      <div class="scroll-page-item">{{ text2 }}</div>
    </r-scroll-page>
  </r-scroll>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useRadio2 } from '@rainbow_ljy/v-hooks'
import { ref, onMounted } from 'vue'
import { setTimeoutPromise } from '@rainbow_ljy/rainbow-js'

const text = arrayLoopMap(100, () => '我').join('')
const text2 = arrayLoopMap(100, () => '李').join('')
const bool = ref(true)
const value = ref("2")
</script>

<style lang="scss">
.scroll-page-demo {
font-size: 80px;

  .sticky {
    background: white;
  }

  r-scroll-page,
  r-scroll-page-item {
    font-size: 80px;
    --r-scroll-offset-top: 92px;
  }
}

.scroll-page-item {
  background: linear-gradient(gold, pink);
}
</style>
