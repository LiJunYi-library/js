<template>
  <div class="hooks-promise">
    <div>
      <div> loading:{{ pList.loading }}</div>
      <div> begin:{{ pList.begin }}</div>
      <div> error:{{ pList.error }}</div>
      <div> data:{{ pList.data }}</div>
      <div> errorData:{{ pList.errorData }}</div>
    </div>
    <div>
      <button @click="nextSend">nextSend</button>
      <button @click="pList.send()">send</button>
      <button @click="pList.abortPrve()">abortPrve</button>
      <button @click="pList.abort()">abort</button>
      <button @click="awaitSend()">awaitSend</button>
    </div>
  </div>
</template>
<script setup>
import { promiseAbortController, promiseSetTimeout } from '@rainbow_ljy/rainbow-js'
import { useListPagination, usePromise } from '@rainbow_ljy/v-hooks'
import { computed, onMounted, customRef, reactive, ref } from 'vue'
import { ElTableColumn, ElButton, ElSelect, ElOption } from 'element-plus'
import { useSpuFetch } from '@/hooks'
import RPaginationTable from './r-el-pagination-table.vue'



const pList = usePromise(async (a) => {
  if (a === 5) return Promise.reject('err')
  await promiseSetTimeout(3000);
  return { list: [], a }
})

let a = 1
async function nextSend(params) {
  a++

  pList.nextSend(a).then((res) => {
    console.log('pList.nextSend  then', res)
  }).catch((err) => {
    console.log('pList.nextSend catch', err)
  })
}


async function awaitSend() {
  a++
  await pList.awaitSend(a).then((res) => {
    console.log('pList.awaitSend  then', res)
  }).catch((err) => {
    console.log('pList.awaitSend catch', err)
  })
}

onMounted(() => {
  // pList.nextSend()
})
</script>

<style lang="scss" scoped>
.hooks-promise {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
}
</style>
