<template>
</template>

<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js';
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
