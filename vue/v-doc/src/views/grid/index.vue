<template>
    <div>

    </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js';
import { useRadio2 } from '@rainbow_ljy/v-hooks';
import { RNestedScroll, RScrollRefresh, RScroll, RScrollMemoryBubble, RScrollVirtualGridList } from '@rainbow_ljy/v-view'
import { ref } from 'vue'
const bool = ref(true);
const List = ref(arrayLoopMap(100, (value) => ({ value })))

function refresh(params) {
    return new Promise(re => setTimeout(re, 2000))
}

const radio = useRadio2({ list: arrayLoopMap(100, (value) => ({ value: 'v' + value, label: value + '*' })) })


console.log(radio);


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