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
const p = { text: 'zzzzzz', loading: true, }


async function click(params) {
  rainbow.toast.open(p)
}

function close(params) {
  rainbow.toast.close(p)
}

const p2 = {
  text: <div >
    <div >
      {name.value}
    </div>
    <div >
      {name.value}
    </div>
  </div>
}

function click2(params) {
  rainbow.toast.open(p2)
}

function close2(params) {
  rainbow.toast.close(p2)
}

const p3 = { loading: true, }

function click3(params) {
  rainbow.toast.open(p3)
}

function close3(params) {
  rainbow.toast.close(p3)
}


function toast(params) {
  rainbow.toast.show(p)
}

</script>
