<template>
  <div class="scroll-layout-virtual-falls-demo">
    <r-scroll>
      <!-- <r-scroll-sticky style="top: 0;">
        <button @click="empty">empty</button>
      </r-scroll-sticky> -->
      <div class="long-content">虚拟化瀑布流布局 回收列表</div>
      <VRVirtualFallsList
        ref="virtualList"
        class="my-scroll-virtual-falls-list-tree"
        v-model="treeList"
        :keyExtractor="({ item }) => item.id"
        :itemClassName="({ item }) => item.myType || '-'"
      >
        <template #item="{ item, index, key }">
          <div
            v-if="item.myType === 'header'"
            class="item-header"
            :class="['item-header-' + item.index]"
          >
            {{ item.value }}
            {{ item.title }}
          </div>
          <div v-else class="item-content" :class="['item-content-' + item.index]">
            <div>{{ item.value }}</div>
            <div>{{ item.title }}</div>
          </div>
        </template>
      </VRVirtualFallsList>
      <div class="long-content">虚拟化瀑布流布局 回收列表</div>
      <VRVirtualFallsList
        ref="virtualList"
        class="my-scroll-virtual-falls-list"
        v-model="List"
        :keyExtractor="({ item }) => item.id"
      >
        <template #item="{ item, index, key }">
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
      </VRVirtualFallsList>
      <div class="long-content">虚拟化瀑布流布局 回收列表</div>
      <div class="long-content">虚拟化瀑布流布局 回收列表</div>
      <div>更多推荐</div>
      <r-move style="position: fixed; left: 0; top: 200px; z-index: 100; background: wheat">
        {{ moreList.length }}
      </r-move>
      <div class="more-scroll-virtual-falls-list-bg">
        <VRVirtualFallsList
          id="vID"
          v-model="moreList"
          :keyExtractor="({ item }) => item?.id"
          class="more-scroll-virtual-falls-list"
        >
          <template #item="{ item, index, key }">
            <div>index:{{ index }}</div>
            <div>id:{{ item?.id }}</div>
            <div>nth:{{ item?.nth }}</div>
            <div class="title">{{ item?.title }}</div>
          </template>
        </VRVirtualFallsList>
      </div>
    </r-scroll>
  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { VRVirtualFallsList } from '@rainbow_ljy/v-views'
import { onMounted, ref, computed } from 'vue'



const tree = ref(
  arrayLoopMap(10, (value) => ({
    index: value,
    value,
    nth: `第${value}个`,
    id: Math.random(),
    title: arrayLoopMap(Math.floor(Math.random() * 3), () => '头部').join(''),
    children: arrayLoopMap(8, (index) => ({
      index,
      value: value + '-' + index,
      nth: `第${value + '-' + index}个`,
      id: Math.random(),
      title: arrayLoopMap(Math.floor(Math.random() * 20), () => '内容').join(''),
      children: [],
    })),
  })),
)

const treeList = computed(() => {
  return tree.value
    .map((el) => {
      el.myType = 'header'
      return [el, el.children]
    })
    .flat(Infinity)
})

const List = ref(
  arrayLoopMap(80, (value) => ({
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
    title: arrayLoopMap(Math.floor(Math.random() * 50 + 50), () => '标题').join(''),
  })),
)

function empty(params) {
  List.value.splice(0)
  console.log(List.value)
}

function insert(item, index) {
  List.value.splice(index + 1, 0, {
    value: '********',
    nth: '********',
    id: Math.random(),
    title: arrayLoopMap(Math.floor(Math.random() * 5), () => 'insert').join(''),
  })
  console.log(List)
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
  console.log({ ...item })
  List.value.unshift({ ...item })
}
</script>

<style lang="scss">
.scroll-layout-virtual-falls-demo {
  .my-scroll-virtual-falls-list-tree {
    --r-columns: 1;
    --r-avg-height: 200px;
    --r-column-gap: 0px;
    --r-row-gap: 0px;
    --r-gap: 0px;
    .item-header {
      background: white;
      height: 30px;
      overflow: hidden;
      padding-bottom: 5px;
      margin-top: 10px;
      position: sticky;
      top: 0;
      &.item-header-0 {
        margin-top: 0px;
      }
    }
    .item-content {
      background: wheat;
      height: 150px;
      border-top: 1px solid;
      &.item-content-0 {
        border-top: none;
      }
    }
  }
  .my-scroll-virtual-falls-list {
    --r-columns: 1;
  }

  .r-scroll-virtual-falls-list-item {
    background: rgb(255, 191, 0);
  }

  .long-content {
    background: linear-gradient(yellow, cyan);
    height: 1400px;
  }

  .more-scroll-virtual-falls-list-bg {
    background: rgb(194, 4, 252);
  }

  .more-scroll-virtual-falls-list {
    --r-avg-height: 200px;
    --r-columns: 2;
    --r-column-gap: 5px;
    --r-row-gap: 2px;
  }
}
</style>
