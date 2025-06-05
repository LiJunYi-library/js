<template>
  <r-scroll class="scroll-page-demo">
    <!-- <div class="rrrr">
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
    </div> -->
    <r-scroll-sticky style="top: 0;" class="sticky">
      <div>v: {{ value }}</div>
      <div @click="value = '1'" ref="div1">v1 </div>
      <div @click="value = '2'" ref="div2">v2 </div>
    </r-scroll-sticky>
    <!-- .... -->
    <r-scroll-page v-model="value" :controller="controller">
      <r-scroll-page-item value="1">
        <div class="scroll-page-item">{{ text }}</div>
      </r-scroll-page-item>
      <r-scroll-page-item value="2">
        <div class="scroll-page-item">{{ text2 }}</div>
      </r-scroll-page-item>
       <r-scroll-page-item value="3">
        <div class="scroll-page-item">{{ text3 }}</div>
      </r-scroll-page-item>
      <!-- <div class="scroll-page-item">{{ text }}</div> -->
    </r-scroll-page>
    <!-- .... -->
  </r-scroll>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useRadio2 } from '@rainbow_ljy/v-hooks'
import { ref, onMounted } from 'vue'
import { setTimeoutPromise } from '@rainbow_ljy/rainbow-js'

const text = arrayLoopMap(100, () => '我').join('')
const text2 = arrayLoopMap(10, () => '李').join('')
const text3 = arrayLoopMap(10, () => '好').join('')
const bool = ref(true)
const value = ref("2")
const div1 = ref("div1")
const div2 = ref("div2")
const controller = {
  views: [div1, div2],
  layout: ({ child, index }) => {

   if(controller.views[index]?.value)  controller.views[index].value.style.background
      = `linear-gradient(90deg, red 0%, red ${child.$$.ratio * 100}%,transparent ${child.$$.ratio * 100}%, transparent 100%)`
  }
}
</script>

<style lang="scss">
.scroll-page-demo {

  .sticky {
    background: white;
    overflow: hidden;
    height: 100px;

    div {
      margin: 10px 0;
    }
  }

  r-scroll-page,
  r-scroll-page-item {
    font-size: 80px;
    --r-scroll-offset-top: 100px;
  }
}

.scroll-page-item {
  background: linear-gradient(gold, pink);
}


.rrrr {
  display: grid;
  --repeat: calc(100vw / 50);
  grid-template-columns: fit-content(40%);
}
</style>
