<template>
  <div @blur="">
    <r-input type="password" label="名字" name="names" :maxlength="maxlength" autocomplete="off" v-model="text"
      @input="input" @clear="clear" @focus="focus" placeholder="请输入名字"></r-input>

    <input type="text" maxlength="5" minlength="2" />

    <!-- <el-input
      v-model="text"
      style="width: 240px"
      maxlength="10"
      placeholder="Please input"
      show-word-limit
      clearable
      show-password
      type="text"
      @input="input"
    /> -->
    <button @click="$log(text)">log {{ text }}</button>
    <button @click="label += '9'">maxlength</button>
  </div>
</template>

<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useListRadio } from '@rainbow_ljy/v-hooks'
import { ref, onMounted, reactive } from 'vue'
import { createTabsSrollPageController } from '@rainbow_ljy/rainbow-element/main'
import { ElInput } from 'element-plus'
const label = ref('label')
const text = ref('789')
const maxlength = ref(10)

function input(params) {
  console.log('input', params)
}

function clear(params) {
  console.log('clear', params)
}

function focus(params) {
  console.log('focus', params)
}
</script>
