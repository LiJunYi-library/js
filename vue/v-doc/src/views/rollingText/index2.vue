<template>
  <div>
    <div>
      <span solt="end" class="iconfont">&#xe745;---&#xe745;</span>
    </div>
    <span solt="fold">~</span>
    <span solt="unfold">^</span>
 <!-- <span solt="end">...</span> -->
    <r-fold-text  v-model="valuev" >
    </r-fold-text>

    <div style="height: 200px;background: chartreuse;">
      <span solt="end" class="iconfont">&#xe745;---&#xe745;</span>
    </div>
  </div>
</template>
<script setup>

import { ref } from 'vue'

const ov ="哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇"
const hv ="哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇"

const valuev = ref(hv)

// setTimeout(() => {
//   valuev.value = ov
// }, 1000);



</script>
