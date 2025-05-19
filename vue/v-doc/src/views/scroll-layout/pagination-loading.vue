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
      <!--  <div>{{ text }}</div> -->
      <!-- <div> -->
      <!-- </div> -->
      <VRPaginationLoading @rollToBottom="rollToBottom" :loadingHook="listload">
        <div>
          <template v-for="(item, index) in listload.list" :key="item.value">
            <div class="item">index{{ index }}</div>
          </template>
        </div>
      </VRPaginationLoading>
    </r-scroll>
  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { VRPaginationLoading } from '@rainbow_ljy/v-views'
import { VlistLoad } from '@rainbow_ljy/v-hooks'
import { computed, onMounted } from 'vue'
import { MFetch } from '@/hooks'

const text = arrayLoopMap(300, () => '帅').join('')

const listload = (() => {
  let list = new VlistLoad()
  const body = computed(() => ({
    time: 1000,
    currentPage: list.currentPage,
    pageSize: list.pageSize,
  }))
  const asyncHook = new MFetch({
    url: '/serve/page',
    method: 'post',
    body,
  })
  list = new VlistLoad({ asyncHook })
  return list
})()

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
