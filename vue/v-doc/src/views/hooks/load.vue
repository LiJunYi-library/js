<template>
  <div class="scroll-pagination-loading">
    <r-scroll>
      <r-scroll-sticky style="top: 0px">
        <div>
          total -{{ listload.total }} currentPage -{{ listload.currentPage }} pageSize -{{
            listload.pageSize
          }}
          finished -{{ listload.finished }} empty -{{ listload.empty }}
          <button @click="listload.nextBeginSend()">nextBeginSend</button>
          <button @click="errorSend()">errorSend</button>
        </div>
      </r-scroll-sticky>
      <div>{{ text }}</div>

      <VRPaginationLoading @rollToBottom="rollToBottom" :loadingHook="listload">
        <div>
          <template v-for="(item, index) in listload.list" :key="item.value">
            <div class="item">
              <img :src=" item.image " height="100px"/>
            </div>
          </template>
        </div>
      </VRPaginationLoading>
    </r-scroll>
  </div>
</template>
<script setup>
import { arrayLoopMap, List } from '@rainbow_ljy/rainbow-js'
import { VRPaginationLoading } from '@rainbow_ljy/v-views'
import { VlistLoad, useVlistLoad } from '@rainbow_ljy/v-hooks'
import { computed, onMounted } from 'vue'
import { SpuFetch } from '@/hooks'

const a = {ss(){}}
const b = {ss(c){}}

console.log(Object.assign( a,b  ))

const text = arrayLoopMap(100, () => '帅').join('')

const listload = (() => {
  let list;
  const body = computed(() => ({
    time: 1000,
    page: list.currentPage,
    rows: list.pageSize,
  }))
  const asyncHook = new SpuFetch({
    url: '/spu/list',
    method: 'post',
    body,
  })
  list = useVlistLoad({ asyncHook, formatterList: (res) => res?.records || [] })
  return list
})()
  console.log(listload)

function errorSend() {
  listload.nextBeginSend({
    body: {
      time: 1000,
      code: 400,
    },
  })
}

function rollToBottom(params) {
  listload.awaitSend({
    body: {
      time: 1000,
      code: 400,
    },
  })
}

onMounted(() => {
  console.log(listload)
  listload.nextBeginSend()
})
</script>

<style lang="scss">
.scroll-pagination-loading {
  font-size: 20px;
  position: sticky;

  .item {
    height: 150px;
    background: cyan;
    margin-top: 10px;
  }
}
</style>
