<template>
  <r-scroll class="VirtualFallsList-page" :class="name">
    <VirtualFallsList v-model="List">
      <template #default="{ item, index, key }">
        <img :src="item.image" width="90%">
        <button @click="changeIndex(index)">修改</button>
        <button @click="List.splice(index, 1)">删除</button>
        <div>{{ key }}</div>
        <div>{{ item.id }}</div>
        <div>{{ item.title }}</div>
        <div>{{ item.name }}</div>
      </template>
    </VirtualFallsList>

    <!-- <r-falls class="my-falls">
      <div>五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五</div>
      <div>
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
      </div>
      <div>
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
      </div>
      <div>
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
      </div>
      <div>
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
      </div>
      <div>五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五</div>
      <div>
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
      </div>
      <div>五五五五五五五五五五五五五五五</div>
      <div>
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
      </div>
    </r-falls> -->
  </r-scroll>
</template>
<script setup>
import { arrayLoopMap, ListArray } from '@rainbow_ljy/rainbow-js'
import { useRadio2 } from '@rainbow_ljy/v-hooks'
import { ref } from 'vue'
import VirtualFallsList from './VirtualFallsList.vue'
import { useFetch } from '@/utils/request'

const spuList = useFetch({
  url: 'https://spu.manmanbuy.com/spu/list',
  method: 'post',
  body: { page: 1, rows: 1000 }
})

const name = ref('bottom-center')
const bool = ref(true)
const arrays = new ListArray()
// arrays.push(
//   ...arrayLoopMap(10, (value) => ({
//     value,
//     id: Math.random(),
//     title: arrayLoopMap(Math.floor(Math.random() * 100), (i) => '我').join(''),
//   })),
// )
const List = ref([])
const gap = ref(10)
const columns = ref(4)

const styles = ref([])

styles.value[0] = { left: '20px' }

styles.value[0] = { left: '40' }
function refresh(params) {
  return new Promise((re) => setTimeout(re, 2000))
}

function changeIndex(index) {
  // console.log(index);
  List.value.splice(index, 1, { value: 9999, id: Math.random() })
}

const radio = useRadio2({
  list: arrayLoopMap(100, (value) => ({ value: 'v' + value, label: value + '*' })),
})

function scroll(params) {
  // console.log('scroll', params);
}
setTimeout(async () => {
  await spuList.nextSend();
  const d = (spuList.data?.records ?? []);
  List.value.push(...d)
}, 0)

// setTimeout(() => {
//   // bool.value = false
//   name.value = 'right-bottom'
//   gap.value = false
//   columns.value = 5
// }, 4000)
</script>

<style></style>
