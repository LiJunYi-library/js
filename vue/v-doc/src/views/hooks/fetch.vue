<template>
  <div class="hooks-promise">
    <div>
      <div>{{ a }}</div>
      <div>{{ d }}</div>
      <div> loading:{{ pList.loading }}</div>
      <div> begin:{{ pList.begin }}</div>
      <div> error:{{ pList.error }}</div>
      <div @click="pList.data.total = 50"> data:{{ pList.data }}</div>
      <div> errorData:{{ pList.errorData }}</div>
    </div>
    <div>
      <button @click="push()">push</button>
      <button @click="copy()">copy</button>
      <button @click="send()">send</button>
      <button @click="nextSend">nextSend</button>
      <button @click="awaitSend()">awaitSend</button>
      <button @click="pList.abortPrve()">abortPrve</button>
      <button @click="pList.abort()">abort</button>
    </div>
  </div>
</template>
<script setup>
import { promiseAbortController, arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useListPagination, usePromise } from '@rainbow_ljy/v-hooks'
import { computed, onMounted, customRef, reactive, ref } from 'vue'
import { ElTableColumn, ElButton, ElSelect, ElOption } from 'element-plus'
import { useMFetch } from '@/hooks'
import RPaginationTable from './r-el-pagination-table.vue'

class A {
  constructor(parameters) {

  }

  toString() {
    return 'aaaaaaaa---'
  }
  valueOf() {
    return 'aaaaaaaa---'
  }
}

const d = ref(new Date())
d.value.toString = () => 'aaaaaaaa---'
const a = new A()
console.log(d)
console.log(a)

const body = computed(() => ({
  time: 20000,
  page: 1,
  rows: 2,
  // total: 100,
  // list: arrayLoopMap(3, () => ({ id: Math.random(), name: Math.random() }))
}))

const pList = useMFetch({
  url: '/serve/page',
  method: 'post',
  body,
  urlParams: {
    a: 5,
    b: { d: 9 },
    c: [123, 456],
    d: [{ f: 6 }]
  },
  headers: {
    'content-type': undefined,
    'token': '++++++++++++++++++',
  },
})


let testList = arrayLoopMap(1000000, (i) => ({ value: i, label: i, i, o: i, p: { i } }));

let lll = ref([1, 2, 3])

console.log(lll)
function push() {
  const s = Date.now();
  testList.push({ value: 111, label: 1111 });
  const e = Date.now();
  console.log(e - s);
}

function copy() {
  const s = Date.now();
  testList = [...testList, { value: 111, label: 1111 }];
  const e = Date.now();
  console.log(e - s);
}


async function nextSend(params) {
  pList.nextSend().then((res) => {
    console.log('pList.nextSend  then', res)
  }).catch((err) => {
    console.log('pList.nextSend catch', err)
  })
}


async function awaitSend() {
  await pList.awaitSend().then((res) => {
    console.log('pList.awaitSend  then', res);
  }).catch((err) => {
    console.log('pList.awaitSend catch', err)
  })
}

async function send() {
  await pList.send().then((res) => {
    console.log('pList.send  then', res);
  }).catch((err) => {
    console.log('pList.send catch', err)
  })
}


</script>

<style lang="scss" scoped>
.hooks-promise {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
}
</style>
