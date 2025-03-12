<template>
  <div  :asdf="name">
    <!-- <rainbow-element>
      <div>111</div>
      <div>222</div>
      <div>333</div>
      <div>4444</div>
    </rainbow-element> -->

    <r-grid :class="name" :r-columns="3" useAttrs r-gap="10px">
      <div>111<div>111</div></div>
      <div>222<div>222</div></div>
      <div>333
        <div v-if="name==='name'">4444</div>
      </div>
      <div v-if="name==='name'">4444</div>
      <div v-if="name==='name'">55555</div>
    </r-grid>


    <button @click="name='name'">classname</button>
  </div>
</template>
<script setup>
import { arrayLoopMap } from "@rainbow_ljy/rainbow-js";
import { useRadio2 } from "@rainbow_ljy/v-hooks";
import { ref, onMounted } from "vue";
const name = ref('asd')



</script>

<style >
  .name{
    --r-columns:3
  }
</style>
