<template>
  <div class="nested-scroll-demo">
    <r-nested-scroll class="n1">
      <div>{{ text }}</div>
      <!-- style="height:80vh"  -->
      <r-nested-scroll class="n1-1">
        <div>{{ text2 }}</div>
      </r-nested-scroll>
    </r-nested-scroll>
  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useRadio2 } from '@rainbow_ljy/v-hooks'
import { ref, onMounted } from 'vue'
import { promiseSetTimeout } from '@rainbow_ljy/rainbow-js'

const text = arrayLoopMap(6, () => '我').join('')
const text2 = arrayLoopMap(300, () => '李').join('')
const bool = ref(true)
</script>

<style lang="scss">
.nested-scroll-demo {
  font-size: 80px;
  cursor: pointer;
}
</style>
