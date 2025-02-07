<template>
  <RScroll class="R-Scroll-page">
    <RScrollVirtualFallsListV3 :list="List" :columns="2">
      <template #default="{ item, index }">
        <div>
          <img :src="item.image" width="90%">
          <div>{{ item.id }}</div>
          <div>{{ index }}</div>
          <div>{{ item.title }}</div>
          <div>{{ item.name }}</div>

        </div>
      </template>
    </RScrollVirtualFallsListV3>
  </RScroll>
</template>
<script setup>
import { arrayLoopMap, ListArray } from '@rainbow_ljy/rainbow-js'
import { useRadio2 } from '@rainbow_ljy/v-hooks'
import { ref } from 'vue'
import { RScroll, RScrollVirtualFallsListV3 } from '@rainbow_ljy/v-view'
import { useFetch } from '@/utils/request'

const spuList = useFetch({
  url: 'https://spu.manmanbuy.com/spu/list',
  method: 'post',
  body: { page: 1, rows: 1000 }
})

const List = ref(
  new ListArray(

  )
)

setTimeout(async () => {
  await spuList.nextSend();
  const d = (spuList.data?.records ?? []);
  List.value.push(...d)
}, 0)

</script>

<style></style>
