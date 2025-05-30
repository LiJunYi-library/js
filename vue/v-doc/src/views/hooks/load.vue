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
          <button @click="$log(listload)">look</button>
        </div>
      </r-scroll-sticky>
      <div>{{ text }}</div>

      <VRPaginationLoading @rollToBottom="rollToBottom" :loadingHook="listload">
        <div>
          <template v-for="(item, index) in listload.list" :key="item.value">
            <div class="item">
              <img :src="item.image" height="100px" />

              <ElButton size="small" :type="listload.same(item) ? 'primary' : ''" @click="listload.onSelect(item)">
                {{ item.id }}
              </ElButton>

              <div>{{ item.name }}</div>
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
import { SpuFetch, useSpuFetch } from '@/hooks'
import { ElButton } from "element-plus"
const text = arrayLoopMap(100, () => '帅').join('')

const listload = (() => {
  let list;
  const body = computed(() => ({
    time: 1000,
    page: list.currentPage,
    rows: list.pageSize,
  }))
  const asyncHook = useSpuFetch({
    url: '/spu/list',
    method: 'post',
    body,
  })
  list = useVlistLoad({
    asyncHook,
    isMultiple: true,
    formatterList: (res) => res?.records || [],
    formatterValue: (item) => item?.id,
    formatterLabel: (item) => item?.name,
  })
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
  listload.awaitConcatSend()
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
