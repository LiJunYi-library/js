<template>
  <div class="r-move-demo">




    <div>
      <r-move>
        <div style="width: 80px; height: 80px; background: orangered"></div>
      </r-move>
    </div>







  </div>
</template>
<script setup lang="jsx">
import { arrayLoopMap, ListArray, setTimeoutPromise } from '@rainbow_ljy/rainbow-js'
import { useRadio2, useListLoad2 } from '@rainbow_ljy/v-hooks'
import { ref, render, defineComponent, toRaw, computed, onMounted } from 'vue'





</script>

<style lang="scss">
.r-move-demo {
  height: 100vh;
  position: relative;
  overflow: hidden;

  r-move {
    --r-adsorb: bottom;
    --r-adsorb-border-bottom: 10px;
  }
}
</style>
