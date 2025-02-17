<template>
  <div class="layout-virtual-grid-page">
    <r-scroll>
      <div>
        <div>宫格布局 回收列表</div>
        <div>List.length:{{ List.length }}</div>
      </div>

      <div>
        <div>css</div>
        <div @click="changeColumns(2)">changeColumns</div>
      </div>

      <div>
        <div>属性</div>
      </div>

      <div>这里可以和滚动吸附布局一起使用<a></a></div>

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
      </VRVirtualGridList>
    </r-scroll>
  </div>
</template>
<script setup lang="jsx">
import { arrayLoopMap, ListArray } from '@rainbow_ljy/rainbow-js'
import { VRVirtualGridList } from '@rainbow_ljy/v-view'
import { useRadio2 } from '@rainbow_ljy/v-hooks'
import { ref, render, defineComponent, toRaw, watch } from 'vue'

const List = ref(
  arrayLoopMap(1000000, (value) => ({
    value,
    id: Math.random(),
    title: arrayLoopMap(Math.floor(Math.random() * 10), () => '标题').join(''),
  })),
)

const columns = ref(1)

function changeColumns(val) {
  columns.value = val
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

function refresh(params) {
  return new Promise((re) => setTimeout(re, 2000))
}
</script>

<style>
.layout-virtual-grid-page {
}
</style>
