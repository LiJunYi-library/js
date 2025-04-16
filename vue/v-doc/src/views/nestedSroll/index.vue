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

 <r-nested-scroll class="t1" style=" max-height: 300px" css-name="ff gg">
  <!-- <div  style="position: sticky;left: 0;top: 0;height: 50px;background: cyan;">Column 1</div> -->
    <div class="long2">root1-12346789</div>
    <r-nested-scroll style=" width: 500px;  max-height: 250px">
      <div class="table">
        <div class="table-cell" style="position: sticky;left: 0;top: 0;">Column 1</div>
        <div class="table-cell">Column 2</div>
        <div class="table-cell">Row 1, Cell 1</div>
        <div class="table-cell" >Row 1, Cell 2</div>
        <div class="table-cell">Row 2, Cell 1</div>
        <div class="table-cell">Row 2, Cell 2</div>
        <div class="table-cell">Row 2, Cell 1</div>
        <div class="table-cell">Row 2, Cell 2</div>
        <div class="table-cell">Row 2, Cell 1</div>
        <div class="table-cell">Row 2, Cell 2</div>
        <div class="table-cell">Row 2, Cell 1</div>
        <div class="table-cell">Row 2, Cell 2</div>
        <div class="table-cell">Row 2, Cell 1</div>
        <div class="table-cell">Row 2, Cell 2</div>
        <div class="table-cell">Row 2, Cell 2</div>
        <div class="table-cell">Row 2, Cell 1</div>
        <div class="table-cell">Row 2, Cell 2</div>
        <div class="table-cell">Row 2, Cell 1</div>
        <div class="table-cell">Row 2, Cell 2</div>
        <div class="table-cell">Row 2, Cell 1</div>
        <div class="table-cell">Row 2, Cell 2</div>
        <div class="table-cell">Row 2, Cell 1</div>
        <div class="table-cell">Row 2, Cell 2</div>
      </div>
      <div  style="position: sticky;bottom:  0;top: 0;height: 50px;background: pink;">Column 1</div>
    </r-nested-scroll>
  </r-nested-scroll>
  <!-- <div class="long2" style="height: 200px;min-height: 200px;">root2-12346789</div>
  <Tabs v-model:active="active" swipeable sticky>
    <Tab v-for="index in 4" :title="'标签 ' + index">
        <div class="long2">内容 {{ index }}</div>
    </Tab>
  </tabs> -->
</template>
<script setup>
import { arrayLoopMap, arrayWipeRepetition } from '@rainbow_ljy/rainbow-js'
import { setTimeoutPromise } from '@rainbow_ljy/rainbow-js'
import { ref } from 'vue'
import data from './data.json'
import { columns } from 'element-plus/es/components/table-v2/src/common'
import { Tab, Tabs } from 'vant';

function propPathdd(propPath) {
  let reg = data.result.skuProperties.map(val => {
    if (val.active) return `${val.pid}:${val.active}`
    return '.*?'
  }).filter(Boolean).join(';')
  return new RegExp(reg).test(propPath)
}

function disabled(item, ele) {
  ele.reg = data.result.skuProperties.map(val => {
    if (val.pid === item.pid) return `${val.pid}:${ele.vid}`
    const active = currData.value.find(el => el.vid.split(":")?.[0] === val.pid)
    if (active) return active.vid
    return '.*?'
  }).filter(Boolean).join(';')
  return !data.result.skuMap.some(el => new RegExp(ele.reg).test(el.propPath));
}


function active(item, ele) {
  if (item.active === ele.vid) return item.active = ''
  item.active = ele.vid
  currData.value.push({ vid: `${item.pid}:${ele.vid}` })
}
const currData = ref([])
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
  width: 60px;
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

.long2 {
  font-size: 100px;
  text-wrap: wrap;
  word-wrap: break-word;
  min-height: 800px;
  background: linear-gradient(gold, pink);
}

.table {
        display: grid;
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed; /* 确保列宽按定义分配 */
        grid-template-columns: auto auto auto;
      }
      .table-column {
        display: table-column;
        width: 200px; /* 第一列宽度为 30% */
      }
      .table-column + .table-column {
        width: 400px; /* 第二列宽度为 70% */
      }
      .table-row {
        display: table-row;
      }
      .table-cell {
        display: table-cell;
        height: 50px;
        border-left: 1px solid #ccc;
        border-top: 1px solid #ccc;
        text-align: center;
        box-sizing: border-box;
        background: #f2ebeb;
      }
</style>
