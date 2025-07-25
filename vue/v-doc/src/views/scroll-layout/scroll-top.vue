<template>
  <div class="scroll-demo">
    <r-scroll @scroll="scroll">
      <div v-if="bool">{{ text }}</div>
      <button @click="bool = !bool">bool</button>
      <r-scroll-top></r-scroll-top>
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

function scroll(events) {}
</script>

<style lang="scss">
.scroll-demo {
  font-size: 80px;
}
</style>
