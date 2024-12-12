<template>
    <div class="page" :class="name">
        <RNestedViewPage isRoot :listHook="radio">
            <div style="height: 100vh;background: cyan;">123</div>
            <div style="height: 100vh;background: yellow;">456</div>
            <div style="height: 100vh;background: orange;">789</div>
            <div style="height: 100vh;">1011</div>
        </RNestedViewPage>






    </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js';
import { useRadio2 } from '@rainbow_ljy/v-hooks';
import { ref } from 'vue'
import { RNestedViewPage, RNestedScroll } from '@rainbow_ljy/v-view'

const radio = useRadio2({ index: 0, list: arrayLoopMap(4, () => ({})) })

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
    --r-min-auto-width: 200px;
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