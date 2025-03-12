<template>
  <div class="layout-virtual-grid-page">




      <div>
        <r-move>
          <div style="width: 80px; height: 80px; background: orangered">属性</div>
        </r-move>
      </div>





  </div>
</template>
<script setup lang="jsx">
import { arrayLoopMap, ListArray, setTimeoutPromise } from '@rainbow_ljy/rainbow-js'
import { useRadio2, useListLoad2 } from '@rainbow_ljy/v-hooks'
import { ref, render, defineComponent, toRaw, computed, onMounted } from 'vue'
import { useFetch } from '@/utils/request'

const List = ref(
  arrayLoopMap(100, (value) => ({
    value,
    id: Math.random(),
    title: arrayLoopMap(Math.floor(Math.random() * 50), () => '标题').join(''),
  })),
)

const columns = ref(2)
const nums = ref(60)

let ListLoad
const body = computed(() => ({
  page: ListLoad.currentPage,
  rows: 100,
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

onMounted(() => {
  ListLoad.nextBeginSend()
  console.log(ListLoad)
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
  item.__cache__={...List.value[0].__cache__}
  console.log(item)
  List.value.splice(0, 0, item)
  // List.value.unshift(item)

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
