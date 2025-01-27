<template>
  <r-nested-scroll isRoot @scrollUp="scroll">
    <!-- <RScrollRefresh @refresh="refresh"></RScrollRefresh> -->
    <!-- <div class="long" v-if="bool">333</div>
        <RScrollVirtualGridList :columns="2" :avgHeight="140" :list="List">
            <template #default="{ item }">
                <div>
                    {{ item.value }}
                </div>
            </template>
</RScrollVirtualGridList>
<div class="long">1111111111111111111111111111111111</div> -->
    <!-- <RNestedScroll>
            <RScrollMemoryBubble>MemoryBubble</RScrollMemoryBubble>
            <RScrollRefresh @refresh="refresh"></RScrollRefresh>

            <div class="long">2222222222222222222222</div>
        </RNestedScroll> -->
    <!-- <r-scroll-refresh solt="top" @refresh="refresh"></r-scroll-refresh> -->
     <r-grid>
      <div></div>
     </r-grid>
    <div style="height: 50px;width: 100%; background: cyan;position: sticky;top: 0px;" @touchstart="click"></div>
    <div class="long">{{ name }}</div>
    <r-nested-scroll ref="listscroll"  style="height: calc(100vh - 50px );">
      <div style="height: 50px;width: 100%; background: red;position: sticky;top: 0px;" @touchstart="click"></div>
      <div class="long">333333333333333</div>
    </r-nested-scroll>
  </r-nested-scroll>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js';
import { setTimeoutPromise } from "@rainbow_ljy/rainbow-js";
import { ref } from 'vue'
const bool = ref(true);
const List = ref(arrayLoopMap(100, (value) => ({ value })))
const name = ref('2222222222222222222222222222');
const listscroll = ref('listscroll');

function scroll(params, www) {
  // console.log(params, www)
}


function click(params) {
  console.log(listscroll)
  listscroll.value.scrollTop = 0
}

// setTimeout(() => {


// name.value = '2222'

// setTimeout(() => {


// name.value = '2222222222222222222222'

// }, 4000);

// }, 4000);


async function refresh(event) {
  console.log(event);
  await setTimeoutPromise(1000)
  event.resolve(true)
  console.log('refresh')

}




// setTimeout(() => {
//     bool.value = false
// }, 3000);

</script>

<style>
.long {
  width: 30px;
  font-size: 100px;
  background: linear-gradient(45deg, red, blue);
  text-wrap: wrap;
  word-wrap: break-word;
}

.r-scroll-virtual-grid-list-item {
  background: gold;
}
</style>
