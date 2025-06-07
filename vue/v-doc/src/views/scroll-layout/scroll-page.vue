<template>
  <r-scroll class="scroll-page-demo">
    <div>

      <div class="my-but"></div>

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
        <div @click="change">v: {{ page.value }} {{ Boolean(text) }}</div>
        <button @click="$log(JSON.stringify  (form))">log</button>

        <r-tabs :value="page.value" :controller="controller" @change="(e) => page.updateValue(e.value)">
          <template v-for="(item, index) in page.list" :key="item.value">
            <r-tab-item :value="item.value">
              {{ item.label }}
            </r-tab-item>
          </template>
        </r-tabs>

      </r-scroll-sticky>


      <div class="scroll-page-item">
        {{ text }}
      </div>

      <r-scroll-page :value="page.value" :controller="controller" @change="(e) => page.updateValue(e.value)"
        ref="scrollpage">
        <template v-for="item in page.list" :key="item.value">
          <r-scroll-page-item :value="item.value">
            <div>{{ item.label }}</div>
            <div class="scroll-page-item">
              {{ item.text }}
            </div>
          </r-scroll-page-item>
        </template>
      </r-scroll-page>

      <!-- <div :value="page.value" :controller="controller" @change="(e) => page.updateValue(e.value)" ref="scrollpage">
      <template v-for="item in page.list" :key="item.value">
        <div :value="item.value">
          <div>{{ item.label }}</div>
          <div class="scroll-page-item">
            {{ item.text }}
          </div>
        </div>
      </template>
    </div> -->
    </div>
  </r-scroll>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useListRadio } from '@rainbow_ljy/v-hooks'
import { ref, onMounted, reactive } from 'vue'
import { createTabsSrollPageController } from "@rainbow_ljy/rainbow-element/main"
const text = ref(arrayLoopMap(100, () => '说').join(''))
const scrollpage = ref('scrollpage')
const controller = createTabsSrollPageController()
const page = useListRadio({
  value: 1,
  list: [
    { value: 1, label: '宝贝', text: arrayLoopMap(30, () => '宝贝').join('') },
    { value: 2, label: '评---论', text: arrayLoopMap(50, () => '评论').join('') },
    { value: 3, label: '详-----情', text: arrayLoopMap(4, () => '详情').join('') },
    { value: 4, label: '更多', text: arrayLoopMap(4, () => '更多').join('') },
  ]
})

function change(params) {
  if (!text.value) text.value = arrayLoopMap(100, () => '说').join('')
  else text.value = ''
}

const form = reactive({
  aaaa: page.original.value
})


// setTimeout(() => {
//   // text.value = arrayLoopMap(50, () => '我').join('')
//   page.list[0].text = arrayLoopMap(100, () => '好').join('')
// }, 5000);

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
        color: rgb(255, 98, 0);
      }
    }
  }






  r-scroll-page,
  r-scroll-page-item {
    font-size: 80px;
    --r-scroll-offset-top: 100px;
    display: block;
  }
}

.scroll-page-item {
  background: linear-gradient(gold, pink);
  font-size: 80px;
}


.rrrr {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.my-but{
  width: 120px;
  height: 50px;
  border-radius: 50px;
  background: rgba(255, 106, 106, 0.674);
  box-shadow: inset 0 0 25px 25px red;
}
.my-but:active{
  transition: 0.5s;
  background: rgba(255, 106, 106, 0.674);
  box-shadow: inset 0 0 0px 0px red;
}
</style>
