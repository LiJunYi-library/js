<template>
  <r-scroll class="scroll-page-demo">

    <!-- <r-scroll-sticky style="top: 0;" class="sticky">
      <div>v: {{ page.value }}</div>
      <div class="rrrr">
        <div @click="value = '1'" ref="div1">v1 </div>
        <div @click="value = '2'" ref="div2">v2 </div>
        <div @click="value = '3'" ref="div3">v3 </div>
      </div>
    </r-scroll-sticky>
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
    </r-scroll-page>
    <div class="scroll-page-item">{{ text }}</div> -->


    <r-scroll-sticky style="top: 0;" class="sticky">
      <div>v: {{ page.value }}</div>

      <r-tabs :value="page.value" :controller="controller" @change="(e) => page.updateValue(e.value)">
        <template v-for="(item, index) in page.list" :key="item.value">
          <r-tab-item :value="item.value">
            {{ item.label }}
          </r-tab-item>
        </template>
      </r-tabs>

    </r-scroll-sticky>

    <r-scroll-page :value="page.value" :controller="controller" @change="(e) => page.updateValue(e.value)">
      <template v-for="item in page.list" :key="item.value">
        <r-scroll-page-item :value="item.value">
          <div>{{ item.label }}</div>
          <div class="scroll-page-item">
            {{ item.text }}
          </div>
        </r-scroll-page-item>
      </template>
    </r-scroll-page>


  </r-scroll>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useListRadio } from '@rainbow_ljy/v-hooks'
import { ref, onMounted } from 'vue'
import { setTimeoutPromise } from '@rainbow_ljy/rainbow-js'
import { createTabsSrollPageController } from "@rainbow_ljy/rainbow-element/main"

const page = useListRadio({
  value: 2,
  list: [
    { value: 1, label: '宝贝', text: arrayLoopMap(50, () => '我').join('') },
    { value: 2, label: '评---论', text: arrayLoopMap(20, () => '李').join('') },
    { value: 3, label: '详-----情', text: arrayLoopMap(10, () => '好').join('') },
    { value: 4, label: '更多', text: arrayLoopMap(10, () => '多').join('') },
  ]
})

const controller = createTabsSrollPageController()


</script>

<style lang="scss">
.scroll-page-demo {

  .sticky {
    background: white;
    overflow: hidden;
    height: 100px;

  }

  r-tabs {
    gap: 0px;

    &::part(r-tab-active) {
      display: none;
    }

    r-tab-item {
      padding: 5px 12px;
      color: rgb(91, 91, 91);
      flex: 1;
      text-align: center;

      &.r-tab-item-act {
        color: black;
      }
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
  grid-template-columns: repeat(3, 1fr);
}
</style>
