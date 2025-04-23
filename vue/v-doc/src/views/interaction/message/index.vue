<template>
  <div class="toast-demo">
    <div style="display: flex;">
      <button class="tttt" @click="click">click</button>
      <button class="tttt" @click="close">close</button>
      <button class="tttt" @click="click2">click</button>
      <button class="tttt" @click="close2">close</button>
      <button class="tttt" @click="click3">click3</button>
      <button class="tttt" @click="close3">close</button>
      <button class="tttt" @click="toast">toast</button>
    </div>
  </div>
</template>
<script setup lang="jsx">
import { ref } from 'vue'

const name = ref('name')



async function click(params) {
  rainbow.message({
    text: 'zzzzzz',
  })
}

function close(params) {

}



function click2(params) {

}

function close2(params) {

}


function click3(params) {

}

function close3(params) {

}


function toast(params) {

}

</script>
