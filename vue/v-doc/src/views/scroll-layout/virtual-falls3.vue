<template>
  <RScroll class="scroll-layout-virtual-falls-demo3" :rubberBand="false" popupDisableScroll ref="scrollView"
    :triggerScrollBottomHeight="500">
    <!-- <div class="long-content"></div> -->

    <div><button @click="nextBeginSend">nextBeginSend</button></div>
    <div>
      <VRPaginationLoading :loadingHook="listLoad">
        <RScrollVirtualFallsListV3 class="activity_618-list-load" :list="listLoad.list">
          <template #default="{ item }">
            <div>
              <div> {{ item.name }}</div>
              <img :src="item.image" width="200" />

            </div>
          </template>
        </RScrollVirtualFallsListV3>
      </VRPaginationLoading>

    </div>
    <div><button @click="nextBeginSend">nextBeginSend</button></div>
  </RScroll>
</template>
<script setup>

import { arrayLoopMap, } from '@rainbow_ljy/rainbow-js'
import { RScroll} from '@rainbow_ljy/v-view';
import { VRPaginationLoading, RScrollVirtualFallsListV3 } from '@rainbow_ljy/v-views/src/index';
import { useListLoad2 } from '@rainbow_ljy/v-hooks';
import { onMounted, ref, computed } from 'vue';
import { useFetch } from "@/utils/request"


const listLoad = (() => {
  let list = {};
  const body = computed(() => {
    const d = {
      page: list.currentPage,
      rows: 10,
    };
    return d;
  });
  const mFetch = useFetch({
    method: 'post',
    url: 'https://spu-test.manmanbuy.com/spu/list',

    body,
  });
  list = useListLoad2({
    pageSize: 10,
    asyncHooks: mFetch,
    setList: (res = {}) => res.records || [],
    setTotal: (res = []) => res?.total * 1,
  });
  return list;
})();


onMounted(() => {
  listLoad.nextBeginSend();
})

function nextBeginSend(params) {
  // listLoad.begin = true;
  // listLoad.list = []
  listLoad.resetNextBeginSend();
}


</script>

<style lang="scss">
.scroll-layout-virtual-falls-demo3 {
  .my-scroll-virtual-falls-list {
    --r-columns: 1;
  }

  .r-scroll-virtual-falls-list-item {
    background: rgb(255, 191, 0);
  }

  .long-content {
    background: linear-gradient(yellow, cyan);
    height: 1400px;
  }


  .more-scroll-virtual-falls-list-bg {
    background: rgb(194, 4, 252);
  }

  .more-scroll-virtual-falls-list {
    --r-avg-height: 200px;
    --r-columns: 2;
    --r-column-gap: 5px;
    --r-row-gap: 2px;
  }
}
</style>
