<template>
  <div class="scroll-load-demo">
    <r-scroll-window>
      <r-scroll-refresh slot="top" :onrefresh="onrefresh"></r-scroll-refresh>
      <r-scroll @scroll="scroll">
        <r-scroll-sticky style="top: 0px">
          <button
            @click="
              listload.afreshNextBeginSend({
                body: {
                  time: 1000,
                  code: 400,
                },
              })
            "
          >
            错误加载
          </button>
          <button
            @click="
              listload.afreshNextBeginSend({
                body: {
                  total: 0,
                  list: [],
                },
              })
            "
          >
            加载为空
          </button>
          <button @click="listload.afreshNextBeginSend()">afreshNextBeginSend</button>
          <button @click="listload.afreshNextSend()">afreshNextSend</button>
        </r-scroll-sticky>
        <div style="font-size: 40px">
          {{ text }}
          {{ listload.loading + '' }}
          {{ listload.finished + '' }}
          {{ listload.empty + '' }}
          {{ listload.begin + '' }}
          {{ listload.error + '' }}
        </div>
        <r-scroll-load
          :loading="listload.loading"
          :finished="listload.finished"
          :empty="listload.empty"
          :begin="listload.begin"
          :error="listload.error"
          @rollToBottom="onrollToBottom"
        >
          <div slot="begin">开始加载</div>
          <div slot="loading">正在加载中</div>
          <div slot="finished">没有更多的了</div>
          <div slot="empty">暂无数据</div>
          <div slot="error" @click="listload.continueAwaitSend()">出错了点击继续加载</div>
          <div slot="begin-error" @click="listload.afreshNextBeginSend()">出错了点击重新加载</div>

          <!--
          <div>
            <template v-for="(item, index) in listload.list" :key="item.value">
              <div class="item">index{{ index }} {{ item.id }}</div>
            </template>
          </div> -->

          <VRVirtualGridList
            v-model="listload.list"
            :keyExtractor="({ item }) => item?.id"
            class="more-scroll-virtual-grid-list"
          >
            <template #item="{ item, index, key }">
              <div class="item">
                <div>index:{{ index }}</div>
                <div>id:{{ item?.id }}</div>
                <div>nth:{{ item?.nth }}</div>
                <div class="title">{{ item?.title }}</div>
              </div>
            </template>
          </VRVirtualGridList>
        </r-scroll-load>
      </r-scroll>
    </r-scroll-window>
  </div>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { setTimeoutPromise } from '@rainbow_ljy/rainbow-js'
import { useVlistLoad } from '@rainbow_ljy/v-hooks'
import { useSpuFetch, useMFetch } from '@/hooks'
import { VRVirtualGridList } from '@rainbow_ljy/v-views'

const text = arrayLoopMap(10, () => '我').join('')

const listload = (() => {
  let list
  const body = computed(() => ({
    time: 2000,
    page: list.currentPage,
    rows: list.pageSize,
    total: 50,
    list: arrayLoopMap(10, () => ({ id: Math.random(), name: Math.random() })),
    // total: 0,
    // list: [],
  }))
  // const asyncHook = new useSpuFetch({
  //   url: '/spu/list',
  //   method: 'post',
  //   body,
  // })
  const asyncHook = useMFetch({
    url: '/serve/page',
    method: 'post',
    body,
  })

  list = useVlistLoad({
    asyncHook,
    // formatterList: (res) => res?.records || []
  })
  return list
})()

async function onrefresh() {
  await listload.afreshNextBeginSend()
  // return setTimeoutPromise(300000)
}

async function onrollToBottom() {
  // await listload.continueAwaitSend()
  errorSend()
}

function errorSend() {
  listload.continueAwaitSend({
    body: {
      time: 1000,
      code: 400,
    },
  })
}

onMounted(() => {
  listload.afreshNextBeginSend({
    body: {
      time: 1000,
      code: 400,
    },
  })
  console.log(listload)
  listload.begin = true
  listload.loading = true
  listload.finished = false
  listload.empty = false
  listload.error = false
})
</script>

<style lang="scss">
.scroll-load-demo {
  r-scroll-refresh {
    background: chartreuse;
  }

  .item {
    height: 150px;
    background: cyan;
    height: 100%;
  }

  .more-scroll-virtual-grid-list {
    --r-avg-height: 200px;
    --r-columns: 2;
    --r-column-gap: 5px;
    --r-row-gap: 2px;
  }
}
</style>
