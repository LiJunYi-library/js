<template>
  <div style="height: 100vh;background-color: aqua;position: relative;overflow: hidden;transform-style: preserve-3d;">
    <!-- <div style="position: absolute;width: 100vw;height: 100vh;background: yellow;z-index: -1;"></div> -->
    <!-- <div style="position: absolute;transform: perspective(500px) translateZ(200px);width: 50px;height: 50px;background: red;"></div> -->
    <!-- <div>123 </div>
    <div>123 </div>
    <div>123 </div> -->
    <div style="margin-top: 120px"></div>
    <div>
      <button @click="add">add</button>
      <button @click="min">--</button>
    </div>
    <!-- <r-rolling-text v-model="val" ></r-rolling-text> -->
    <!-- <div>{{ JSON.stringify(riles) }}</div> -->
    <!-- <r-rolling-text-num style="margin-left: 100px;" v-model="val" @input="input" ref="text"/> -->
    <button v-riles="'sdf'">权限</button>
    <button @click="addRules">addRules</button>
    <div></div>
    <!-- <r-rolling-text :r-value="num"></r-rolling-text> -->
    <!-- <div>val:: {{  val  }} </div>:style=" `--r-value: ${num} `"
    <input type="text"  v-model="value" @input="input"> -->
  </div>
</template>
<script setup>
import { arrayLoopMap } from "@rainbow_ljy/rainbow-js";
import { useRadio2 } from "@rainbow_ljy/v-hooks";
import { ref, onMounted } from "vue";
import index2 from "./index2.vue";
import { useLocalStorageRef } from '@rainbow_ljy/v-hooks'
const val = ref(2);
const riles = useLocalStorageRef('riles', [])
const num = ref(987);
function addRules(params) {
  riles.value.push({user:'yyyy'})
}
const text = ref("text");

// setTimeout(() => {
//     val.value = 95
// }, 500);

function input(event) {
  console.log("params", event.target.value);
}

function min(params) {
  val.value--;
}

function add(params) {
  val.value++;
  // text.value.value = val.value
}

onMounted(() => {
  //  text.value.value = val.value
});
</script>
