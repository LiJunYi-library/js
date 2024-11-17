<template>
    <div>

        <!-- <r-flex>
            <div>123</div>
        </r-flex> -->

        <r-scroll>

            <h2 slot="top" class="s-top">Welcome to My Card {{ name }}</h2>
            <p style="width: 20px;font-size: 104px;word-wrap: break-word;">Thisisasimplecardcomponentwithnamedslots.</p>

            <div>
                 <r-scroll-memory-bable top="100px">456789</r-scroll-memory-bable>
            </div>
           

        </r-scroll>

        <!-- <r-scroll-bable>
            <div>123</div>
        </r-scroll-bable> -->


    </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js';
import { useRadio2 } from '@rainbow_ljy/v-hooks';
import { RNestedScroll, RScrollRefresh, RScrollMemoryBubble, RScrollVirtualGridList } from '@rainbow_ljy/v-view'
import { ref } from 'vue'

const name = ref('true');
const bool = ref(true);
const List = ref(arrayLoopMap(100, (value) => ({ value })))

function refresh(params) {
    return new Promise(re => setTimeout(re, 2000))
}

const radio = useRadio2({ list: arrayLoopMap(100, (value) => ({ value: 'v' + value, label: value + '*' })) })


console.log(radio);


setTimeout(() => {
    bool.value = false
    name.value = 'false'
}, 3000);

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