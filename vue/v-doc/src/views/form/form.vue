<template>
  <div @blur="">
    <r-input type="date" label="名字" name="names" :maxlength="maxlength" autocomplete="off" v-model="text"
      @input="input" @clear="clear" @focus="focus"   @blur="blur" placeholder="请输入名字"></r-input>

    <!-- <div tabindex="0">
      <input type="text" @focus="focus" ref="inputel" @blur="blur" name="inputel" />
      <span class="po1">
        <span class="po2">
          <span @click="click"> click</span>
        </span>
      </span>
    </div> -->
    <!-- <myInput  @input="input"
 @blur="blur"
 @focus="focus">

    </myInput> -->


    <!-- <ElInput
      v-model="text"
      style="width: 240px"
      maxlength="10"
      placeholder="Please input"
      show-word-limit
      clearable
      show-password
      type="text"
      @input="input"
      @blur="blur"
      @focus="focus"
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
const inputel = ref('inputel')
const label = ref('label')
const text = ref('')
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

function blur(params) {
  console.log('blur', params)
}

function click(params) {
  console.log('click', inputel.value.setSelectionRange)

  inputel.value.focus()
}
</script>

<style lang="scss" scoped>
.po1 {
  pointer-events: none;
}

.po2 {
  pointer-events: all;
  cursor: pointer;
}
</style>
