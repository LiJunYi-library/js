<template>
  <div class="scroll-layout-virtual-grid-demo">
    <r-scroll>
      <div class="long-content">宫格布局 回收列表</div>
      <!-- <RLoadingLoad :promiseHook="ListLoad"> -->
      <!-- </RLoadingLoad> -->
      <VRVirtualGridList v-model="List" :style="`--r-columns: ${columns};`" :keyExtractor="({ item }) => item.id">
        <template #default="{ item, index, key }">
          <div>index:{{ index }}</div>
          <div>id:{{ item.id }}</div>
          <div>nth:{{ item.nth }}</div>
          <div class="title">{{ item.title }}</div>
          <r-grid style="--r-columns: 4">
            <button @click="insert(item, index)">插入</button>
            <button @click="remove(item, index)">删</button>
            <button @click="change(item, index)">改</button>
            <button @click="transposal(item, index)">置顶</button>
          </r-grid>
        </template>
      </VRVirtualGridList>
      <div class="long-content">宫格布局 回收列表</div>
      <div>更多推荐</div>
      <div class="more-scroll-virtual-grid-list-bg">
        <VRVirtualGridList v-model="moreList" :keyExtractor="({ item }) => item.id"
          class="more-scroll-virtual-grid-list">
          <template #default="{ item, index, key }">
            <div>index:{{ index }}</div>
            <div>id:{{ item.id }}</div>
            <div>nth:{{ item.nth }}</div>
            <div class="title">{{ item.title }}</div>
          </template>
        </VRVirtualGridList>
      </div>

    </r-scroll>
  </div>
</template>
<script setup>
import { arrayLoopMap, } from '@rainbow_ljy/rainbow-js'
import { VRVirtualGridList } from '@rainbow_ljy/v-view'
import { ref } from 'vue'

const columns = ref(1)

const List = ref(
  arrayLoopMap(100, (value) => ({
    value,
    nth: `第${value}个`,
    id: Math.random(),
    title: arrayLoopMap(Math.floor(Math.random() * 20), () => '标题').join(''),
  })),
)

const moreList = ref(
  arrayLoopMap(100, (value) => ({
    value,
    nth: `第${value}个`,
    id: Math.random(),
    title: arrayLoopMap(Math.floor(Math.random() * 20), () => '标题').join(''),
  })),
)

function insert(item, index) {
  List.value.splice(index + 1, 0, {
    value: '********',
    nth: '********',
    id: Math.random(),
    title: arrayLoopMap(Math.floor(Math.random() * 5), () => 'insert').join(''),
  })
  console.log('insert')
}

function remove(item, index) {
  List.value.splice(index, 1)
}

function change(item, index) {
  item.title = '修改item'
  item.name = '修改item'
  console.log(item)
}

function transposal(item, index) {
  List.value.splice(index, 1)
  item.__cache__ = { ...List.value[0].__cache__ }
  console.log(item)
  List.value.unshift(item)
}
</script>

<style lang="scss">
.scroll-layout-virtual-grid-demo {
  .r-scroll-virtual-grid-list-item {
    background: rgb(255, 191, 0);
  }

  .long-content {
    background: linear-gradient(yellow, cyan);
    height: 1400px;
  }


  .more-scroll-virtual-grid-list-bg {
    background: rgb(194, 4, 252);
  }

  .more-scroll-virtual-grid-list {
    --r-avg-height: 200px;
    --r-columns: 2;
    --r-column-gap: 5px;
    --r-row-gap: 2px;
  }
}
</style>
