<template>
    <div>

        <div>



            <!-- <div class="">Welcome to My Card right-bottom</div>
            <div class="">Welcome to My Card right-bottom</div>
            <div class="">Welcome to My Card right-bottom</div> -->
            <!-- <div style="width: 20px;font-size: 104px;word-wrap: break-word;">Thisisasimplecardcomponentwithnamedslots.
            </div> -->
        </div>
        <!-- <div style="height: 200px;position: relative;">
            <r-absolute :position="name" :class="['my', 'dsk']">
                bottom-center
            </r-absolute> 
        </div> -->

        <!--   <r-flex row-gap="10" :column-gap="gap">
            <div>123</div>
            <div>123</div>
        </r-flex> -->
        <!-- <r-flex> </r-flex> -->
        <r-scroll @scroll="scroll">
            <r-scroll-fixed opacity-top="500" opacity-delay="200" top="30" opacity-ani="false">123</r-scroll-fixed>
            <r-absolute position="top-center">
                top-center
            </r-absolute>

            <div slot="top" class="s-top">Welcome to My Card {{ name }}</div>
            <div class="s-top">Welcome to My Card {{ name }}</div>
            <div class="s-top">Welcome to My Card {{ name }}</div>
            <div class="s-top" style="font-size: 100px;">My {{ name }}</div>

            <div style="width: 20px;font-size: 104px;word-wrap: break-word;">
                Thisisasimplecardcomponentwithnamedslots.
            </div>


            <r-scroll-memory-bable top="100px">456789</r-scroll-memory-bable>



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

const name = ref('bottom-center');
const bool = ref(true);
const List = ref(arrayLoopMap(100, (value) => ({ value })))
const gap = ref(10);

function refresh(params) {
    return new Promise(re => setTimeout(re, 2000))
}

const radio = useRadio2({ list: arrayLoopMap(100, (value) => ({ value: 'v' + value, label: value + '*' })) })


function scroll(params) {
    // console.log('scroll', params);
}

console.log(radio);


setTimeout(() => {
    bool.value = false
    name.value = 'right-bottom'
    gap.value = false
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

.r-scroll-fixed {
    height: 50px;
    background: cyan;
}

.r-scroll-fixed-fixed {
    /* background: rgb(0, 85, 255); */
}
</style>