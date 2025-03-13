<template>
  <div class="layout-virtual-grid-page">
    <r-scroll-view class="my-scroll">
      <r-scroll-refresh slot="r-scroll-top" @refresh="refresh"></r-scroll-refresh>

      <!-- <RLoadingLoad :promiseHook="ListLoad"> -->
        <VRVirtualFallsList v-model="List" :style="`--r-columns: ${columns};`">
          <template #default="{ item, index, key }">
            <div>index- :{{ index }}</div>
            <div>id:{{ item.id }}</div>
            <div>nth:{{ item.value }}</div>
            <div>{{ item.title }}</div>
            <div>{{ item.name }}</div>
            <div>{{ item.name }}</div>
            <div>{{ item.name }}</div>
            <div>{{ item.name }}</div>
            <r-grid style="--r-columns: 4">
              <button @click="insert(item, index)">插入</button>
              <button @click="remove(item, index)">删</button>
              <button @click="change(item, index)">改</button>
              <button @click="transposal(item, index)">置顶</button>
            </r-grid>
          </template>
        </VRVirtualFallsList>
      <!-- </RLoadingLoad> -->
    </r-scroll-view>
  </div>
</template>
<script setup lang="jsx">
import { arrayLoopMap, ListArray, setTimeoutPromise } from '@rainbow_ljy/rainbow-js'
import { VRVirtualGridList,VRVirtualFallsList, RLoadingLoad } from '@rainbow_ljy/v-view'
import { useRadio2, useListLoad2 } from '@rainbow_ljy/v-hooks'
import {shallowRef, ref, render, defineComponent, toRaw, computed,onMounted } from 'vue'
import { useFetch } from '@/utils/request'

const d = arrayLoopMap(500, (value) => ({
  value,
  id: Math.random(),
  title: arrayLoopMap(Math.floor(Math.random() * 80), () => "标题").join(""),
}));

const List = ref(d)



const columns = ref(2)
const nums = ref(100)

let ListLoad
const body = computed(() => ({
  page: ListLoad.currentPage,
  rows: 200,
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
  console.log(ListLoad);

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
  item.name= '修改item'
  console.log(item);

}

function transposal(item, index) {
  // List.value.splice(index, 1)
  // List.value.unshift(item)
  console.log(List);
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
