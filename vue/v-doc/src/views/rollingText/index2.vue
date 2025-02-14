<template>
  <div>
    <div>
      <span solt="end" class="iconfont">&#xe745;---&#xe745;</span>
    </div>
    <span solt="fold">~</span>
    <span solt="unfold">^</span>
    <!-- <span solt="end">...</span> -->
    <!-- <r-fold-text  v-model="valuev" >
    </r-fold-text> -->

    <button v-riles="'sdf'" v-if="bool">权限</button>
    <button @click="addRules">权限</button>
    <button @click="bool=!bool">bool</button>
    <div>{{ JSON.stringify(riles) }}</div>
    <div style="height: 200px; background: chartreuse">
      <span solt="end" class="iconfont">&#xe745;---&#xe745;</span>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

import { useLocalStorageRef } from '@rainbow_ljy/v-hooks'

const ov =
  '哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇'
const hv =
  '哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇'

const valuev = ref(hv)

const bool = ref(true)

const riles = useLocalStorageRef('riles', [])

function addRules(params) {
  // riles.value =
  console.log(riles.value)
  riles.value.push({user:'ljy'})
}
</script>
