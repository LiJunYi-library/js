<template>
    <div class="page" :class="name">


        <r-grid class="my-grid"  :r-columns="columns" r-gap="10px" r-min-auto-width="200px">
            <div>五五</div>
            <div grid-column="3">五五</div>
            <div grid-column="2">五五</div>
            <div>五五</div>
            <div>五五</div>
            <div>五五</div>
            <div>五五</div>
            <div>五五</div>
        </r-grid>

        <r-absolute>
            66
        </r-absolute>


        <!-- 
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



        </r-scroll> -->




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
const columns = ref(4);

const styles = ref([]);

styles.value[0] = { left: '20px' }

styles.value[0] = { left: '40' }
function refresh(params) {
    return new Promise(re => setTimeout(re, 2000))
}

const radio = useRadio2({ list: arrayLoopMap(100, (value) => ({ value: 'v' + value, label: value + '*' })) })

// const div = document.createElement('div')
// document.body.append(div)
// div.style.width= 'calc(100vh - 20px)';
// const style = window.getComputedStyle(div);
// console.log(style.getPropertyValue('width'));


function scroll(params) {
    // console.log('scroll', params);
}

console.log(radio);


setTimeout(() => {
  
    // bool.value = false
    name.value = 'right-bottom'
    gap.value = false
    columns.value = 5
}, 4000);

</script>

<style>
.long {
    width: 30px;
    font-size: 100px;
    background: linear-gradient(45deg, red, blue);
    text-wrap: wrap;
    word-wrap: break-word;
}

.r-grid-item {
    background: gold;
}

.r-scroll-fixed {
    height: 50px;
    background: cyan;
}

.r-scroll-fixed-fixed {
    /* background: rgb(0, 85, 255); */
}

.my-grid {
    --r-columns: r-attr(r-columns);
    --r-gap: r-attr(r-gap);
    --r-row-gap: 20px;
    --r-min-auto-width: 100px;
    --r-grid-wrap: wrap;
    --r-grid-stretch: stretch;
}

.my-grid div {
    background: yellow;
}

.bottom-center .my-grid {
    /* --r-columns: 9; */
}

.right-bottom .my-grid {
    /* --r-columns: 6; */
}

/* .dsk {
    width: calc(100vw - 50px);
}

.page .dsk {
    --r-absolute: top;
    flex-wrap: wrap;
    column-width: 30px;

} */
</style>