<template>
    <RNestedScroll isRoot>
        <!-- <RScrollRefresh @refresh="refresh"></RScrollRefresh> -->
        <div class="long" v-if="bool">333</div>
        <RScrollVirtualGridList :columns="2" :avgHeight="140" :list="List">
            <template #default="{ item }">
                <div>
                    {{ item.value }}
                </div>
            </template>
        </RScrollVirtualGridList>
        <div class="long">1111111111111111111111111111111111</div>
        <!-- <RNestedScroll>
            <RScrollMemoryBubble>MemoryBubble</RScrollMemoryBubble>
            <RScrollRefresh @refresh="refresh"></RScrollRefresh>
    
            <div class="long">2222222222222222222222</div>
        </RNestedScroll> -->
    </RNestedScroll>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js';
import { RNestedScroll, RScrollRefresh, RScroll, RScrollMemoryBubble, RScrollVirtualGridList } from '@rainbow_ljy/v-view'
import { ref } from 'vue'
const bool = ref(true);
const List = ref(arrayLoopMap(100, (value) => ({ value })))

function refresh(params) {
    return new Promise(re => setTimeout(re, 2000))
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