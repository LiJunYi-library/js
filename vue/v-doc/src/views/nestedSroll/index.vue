<template>
  <!-- <r-scroll class="root1">
    <r-scroll key="root1-1" style="height:100vh;background:red" class="root1-1">
      <r-scroll key="root1-1-1" style="height:100vh;background:green" class="root1-1-1">
      </r-scroll>
      <r-scroll key="root1-1-2" style="height:100vh;background:cyan" class="root1-1-2">
      </r-scroll>
      <r-scroll key="root1-1-3" style="height:100vh;background:blue" class="root1-1-3">
      </r-scroll>
    </r-scroll>
    <r-scroll key="root1-2" style="height:100vh;background:orange" class="root1-2">
    </r-scroll>
    <r-scroll key="root1-3" style="height:100vh;background:yellow" class="root1-3">
    </r-scroll>
  </r-scroll> -->
  <!-- <r-scroll  @scrollUp="scroll" class="root1">
    <div style="height: 50px; width: 100%; background: cyan; position: sticky; top: 0px" @touchstart="click"></div>
    <div class="long">{{ name }}</div>
    <r-scroll ref="listscroll" class="root2">
      <div class="gggg" style="height: calc(100vh - 50px);">
        <r-scroll key="root3-1" style="width: 100vw; background: red" class="root3-1">
          <div class="long">
            <div class="long">root3-1</div>
            <div class="long">root3-1</div>
          </div>
        </r-scroll>
        <r-scroll key="root3-2" style="width: 100vw; background: orange" class="root3-2">
          <div class="long">root3-2--0123456789</div>
        </r-scroll>
        <r-scroll key="root3-3" style="width: 100vw; background: yellow" class="root3-3">
        </r-scroll>
      </div>
    </r-scroll>
  </r-scroll> -->
  <!-- <r-scroll>
    <div class="long">root1-12346789</div>
    <r-scroll>
      <div class="long">root2-12346789</div>
    </r-scroll>
  </r-scroll> -->
  <div>
    <template v-for="item in List" :key="item.pid">
      <div>
        <div>____________________</div>
        <div>{{ item.name }} {{ item.pid }}</div>
        <div>____________________</div>
        <div>
          <template v-for="ele in item.values" :key="ele.vid">
            <div v-if="disabled(item, ele)">
              <a> {{ ele.name }} {{ ele.vid }}-- {{ ele.reg }}</a>
            </div>
            <div v-else @click="active(item, ele)" :class="[item.active === ele.vid && 'act']">
              {{ ele.name }} {{ ele.vid }}-- {{ ele.reg }}
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup>
import { arrayLoopMap, arrayWipeRepetition } from '@rainbow_ljy/rainbow-js'
import { setTimeoutPromise } from '@rainbow_ljy/rainbow-js'
import { ref } from 'vue'
import data from './data.json'

function disabled(item, ele) {
  ele.reg =  data.result.skuProperties.map(val=>{
    if( val.pid ===item.pid )   return `${val.pid}:${ele.vid}`
    if( val.active ) return `${val.pid}:${val.active}`
    return '.*?'
  }).filter(Boolean).join(';')
  let reg  = new RegExp( ele.reg );
  return !data.result.skuMap.some(el=>reg.test(el.propPath));
}

function active(item, ele) {
  item.active = ele.vid
}

const List = ref(data.result.skuProperties)
const name = ref('11111111111111111111111111')
const listscroll = ref('listscroll')

function scroll(params, www) {
  // console.log(params, www)
}

function click(params) {
  console.log(listscroll)
  listscroll.value.scrollTop = 0
}

async function refresh(event) {
  console.log(event)
  await setTimeoutPromise(1000)
  event.resolve(true)
  console.log('refresh')
}
</script>

<style>
.long {
  width: 30px;
  font-size: 100px;
  background: linear-gradient(45deg, red, blue);
  text-wrap: wrap;
  word-wrap: break-word;
}

.gggg {
  display: inline-flex;
  flex-wrap: nowrap;
}

.root2 {
  --r-scroll-direction: horizontal;
}

.root2 .r-scroll-content {
  display: inline-flex;
  flex-wrap: nowrap;
}

a {
  text-decoration: line-through;
}

.act {
  color: red;
}
</style>
