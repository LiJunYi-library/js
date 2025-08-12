<template>
  <div class="scroll-pagination-loading">
    <r-scroll>
      <r-scroll-sticky style="top: 0px">
        <div style="font-size: 10px">
          <r-grid style="--r-columns: 3">
            <div>total:{{ listload.total }}</div>
            <div>currentPage:{{ listload.currentPage }}</div>
            <div>pageSize:{{ listload.pageSize }}</div>
            <div>finished:{{ listload.finished }}</div>
            <div>empty:{{ listload.empty }}</div>
          </r-grid>
          <r-grid style="--r-columns: 2">
            <ElSelect v-model="req.isPass" size="small" clearable>
              <ElOption value="0" label="0"></ElOption>
              <ElOption value="1" label="1"></ElOption>
            </ElSelect>

            <ElSelect v-model="req.modelSearchKeyword" size="small" clearable>
              <ElOption value="小熊巾" label="小熊巾"></ElOption>
              <ElOption value="玻尿酸" label="玻尿酸"></ElOption>
            </ElSelect>
          </r-grid>

          <div>
            <button @click="listload.afreshNextBeginSend()">afreshNextBeginSend</button>
            <button @click="listload.afreshNextSend()">afreshNextSend</button>
            <button @click="errorSend()">errorSend</button>
            <button @click="$log(listload)">look</button>
          </div>
        </div>
      </r-scroll-sticky>
      <div>{{ text }}</div>

      <VRPaginationLoading @rollToBottom="rollToBottom" :loadingHook="listload">
        <div>
          <template v-for="(item, index) in listload.list" :key="item.value">
            <div class="item">
              <img :src="item.image" height="100px" />

              <ElButton
                size="small"
                :type="listload.same(item) ? 'primary' : ''"
                @click="listload.onSelect(item)"
              >
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
import { computed, onMounted, ref } from 'vue'
import { useSpuFetch, useMFetch } from '@/hooks'
import { ElButton, ElSelect, ElOption } from 'element-plus'
const text = arrayLoopMap(100, () => '帅').join('')

const req = ref({
  isPass: '',
  modelSearchKeyword: '',
})

const listload = (() => {
  let list
  const body = computed(() => ({
    time: 2000,
    ...req.value,
    page: list.currentPage,
    rows: list.pageSize,
    total: 100,
    list: arrayLoopMap(10, () => ({ id: Math.random(), name: Math.random() })),
  }))
  // const asyncHook = useSpuFetch({
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
    // list: [],
    vaule: ['25993'],
    asyncHook,
    isMultiple: true,
    // formatterList: (res) => res?.records || [],
    formatterValue: (item) => item?.id,
    formatterLabel: (item) => item?.name,
  })
  return list
})()

onMounted(async () => {
  console.log(rainbow)
  const a = await listload.afreshNextBeginSend()
  console.log(a)
  listload.updateValue(['25993'])
})

function errorSend() {
  listload.nextBeginSend({
    body: {
      time: 1000,
      code: 400,
    },
  })
}

function rollToBottom(params) {
  listload.continueAwaitSend()
}
</script>

<style lang="scss">
.scroll-pagination-loading {
  font-size: 20px;
  position: sticky;

  .item {
    height: 150px;
    background: cyan;
    margin-bottom: 10px;
  }
}
</style>
