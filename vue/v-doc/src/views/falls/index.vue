<template>
    <div class="page" :class="name">


        <r-falls class="my-falls">
            <div>五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五</div>
            <div>五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五</div>
            <div>五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五</div>
            <div>五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五</div>
            <div>五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五</div>
            <div>五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五</div>
            <div>五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五</div>
            <div>五五五五五五五五五五五五五五五</div>
            <div>五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
                五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
            </div>
        </r-falls>



    </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js';
import { useRadio2 } from '@rainbow_ljy/v-hooks';
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

.my-falls {
    --r-columns: 3;
    --r-min-auto-width: 100px;
    --r-gap: 10px;
    --r-row-gap: 25px;
    --r-column-gap: 15px;
}

.r-falls-item {
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