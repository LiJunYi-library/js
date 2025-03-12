<template>
  <div  :asdf="name">
    <!-- <rainbow-element>
      <div>111</div>
      <div>222</div>
      <div>333</div>
      <div>4444</div>
    </rainbow-element> -->

    <r-falls>
      <div>111</div>
      <div>222</div>
      <div>333
        <div v-if="name==='name'">4444</div>
      </div>
      <div v-if="name==='name'">4444</div>
      <div v-if="name==='name'">55555</div>
    </r-falls>


    <button @click="name='name'">classname</button>
  </div>
</template>
<script setup>
import { arrayLoopMap } from "@rainbow_ljy/rainbow-js";
import { useRadio2 } from "@rainbow_ljy/v-hooks";
import { ref, onMounted } from "vue";
const name = ref('asd')



</script>
