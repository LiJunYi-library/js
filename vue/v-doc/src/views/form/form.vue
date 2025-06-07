<template>
  <div>
    <r-inpput name="names" v-model="text" @focus="input"></r-inpput>

    <!-- <div  @focus="input">
      <input type="text" name="names" v-model="text" >
    </div> -->


    <button @click=" $log(text)">log {{ text }}</button>
  </div>
</template>

<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useListRadio } from '@rainbow_ljy/v-hooks'
import { ref, onMounted, reactive } from 'vue'
import { createTabsSrollPageController } from "@rainbow_ljy/rainbow-element/main"
const text = ref('')

function input(params) {
  console.log("input", params)
}
</script>
