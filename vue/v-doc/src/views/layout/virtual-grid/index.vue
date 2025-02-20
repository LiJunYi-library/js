<template>
  <div class="layout-virtual-grid-page">
    <!-- <div>
        <div>宫格布局 回收列表</div>
        <div>List.length:{{ List.length }}</div>
      </div> -->
    <r-scroll-view class="my-scroll">
      <!-- <div slot="r-scroll-top">
        <div style="height: 200px;">11111111111111111111</div>
      </div> -->
      <r-scroll-refresh slot="r-scroll-top" @refresh="refresh"></r-scroll-refresh>

      <div>
        <div>宫格布局 回收列表</div>
        <div>List.length:{{ List.length }}</div>
      </div>

      <div>
        <r-move>
          <div style="width: 80px; height: 80px; background: orangered">属性</div>
        </r-move>
      </div>

      <div>
        <div>css</div>
        <div @click="changeColumns(2)">changeColumns</div>
      </div>

      <div>
        <div>属性</div>
      </div>

      <div style="position: fixed; right: 0; top: 0; background: pink; z-index: 20">fixed</div>

      <r-scroll-sticky>
        <div style="color: azure">这里可以和滚动吸附布局一起使用<a></a></div>
      </r-scroll-sticky>

      <!--
        <r-scroll-sticky>
          <div style="color: azure;">这里可以和滚动吸附布局一起使用<a></a></div>
        </r-scroll-sticky>-->
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>

      <!-- <div>
        <r-scroll-sticky>
          <div style="color: azure;">这里可以和滚动吸附布局一起使用<a></a></div>
        </r-scroll-sticky>
      </div> -->
<!--
      <VRVirtualGridList v-model="List" :style="`--r-columns: ${columns};`">
        <template #default="{ item, index, key }">
          <div>index:{{ index }}</div>
          <div>id:{{ item.id }}</div>
          <div>nth:{{ item.value }}</div>
          <div>{{ item.title }}</div>
          <r-grid style="--r-columns: 4">
            <button @click="insert(item, index)">插入</button>
            <button @click="remove(item, index)">删</button>
            <button @click="change(item, index)">改</button>
            <button @click="transposal(item, index)">置顶</button>
          </r-grid>
        </template>
      </VRVirtualGridList> -->

      <r-scroll-sticky style="height: 50px">
        <div style="color: azure">这里可以和滚动吸附布局一起使用<a></a></div>
      </r-scroll-sticky>

      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>
      <div>宫格布局 回收列表</div>

      <RLoadingLoad :promiseHook="ListLoad">
        <VRVirtualGridList v-model="ListLoad.list" :style="`--r-columns: ${columns};`">
          <template #default="{ item, index, key }">
            <div>index- :{{ index }}</div>
            <div>id:{{ item.id }}</div>
            <div>nth:{{ item.value }}</div>
            <div>{{ item.name }}</div>
            <r-grid style="--r-columns: 4">
              <button @click="insert(item, index)">插入</button>
              <button @click="remove(item, index)">删</button>
              <button @click="change(item, index)">改</button>
              <button @click="transposal(item, index)">置顶</button>
            </r-grid>
          </template>
        </VRVirtualGridList>
      </RLoadingLoad>
    </r-scroll-view>
  </div>
</template>
<script setup lang="jsx">
import { arrayLoopMap, ListArray, setTimeoutPromise } from '@rainbow_ljy/rainbow-js'
import { VRVirtualGridList, RLoadingLoad } from '@rainbow_ljy/v-view'
import { useRadio2, useListLoad2 } from '@rainbow_ljy/v-hooks'
import { ref, render, defineComponent, toRaw, computed,onMounted } from 'vue'
import { useFetch } from '@/utils/request'

const List = ref(
  arrayLoopMap(20, (value) => ({
    value,
    id: Math.random(),
    title: arrayLoopMap(Math.floor(Math.random() * 10), () => '标题').join(''),
  })),
)

const columns = ref(1)
const nums = ref(60)

let ListLoad
const body = computed(() => ({
  page: ListLoad.currentPage,
  rows: 10,
}))
const f = useFetch({
  method: 'post',
  url: 'https://spu-test.manmanbuy.com/spu/list',
  body,
})

ListLoad = useListLoad2({
  asyncHooks: f,
  setList: (res) => res.records,
  setTotal: (res) => res.total,
})

onMounted(()=>{
  ListLoad.nextBeginSend()
  // console.log(ListLoad);

})

const background = ref('yellow')

function changeColumns(val) {
  columns.value = val
  background.value = 'red'
}

function insert(item, index) {
  List.value.splice(index + 1, 0, {
    value: '********',
    id: Math.random(),
    title: arrayLoopMap(Math.floor(Math.random() * 5), () => 'insert').join(''),
  })
}

function remove(item, index) {
  List.value.splice(index, 1)
}

function change(item, index) {
  item.title = '修改item'
}

function transposal(item, index) {
  List.value.splice(index, 1)
  List.value.unshift(item)
}

async function refresh(event) {
  await setTimeoutPromise(5000)
  event.resolve(true)
}
</script>

<style lang="scss">
.layout-virtual-grid-page {
  .r-scroll-element {
    background: red;
  }

  .r-circle-border {
    background: red;
  }

  r-scroll-sticky {
    top: 10px;
    bottom: 10px;
    background: cyan;
    --r-active-top: 10px;
    --r-active-bottom: 10px;
  }

  .r-scroll-sticky-sticky-top {
    background: pink;
  }

  .r-scroll-sticky-sticky-bottom {
    background: rgb(191, 0, 255);
  }
}
</style>
