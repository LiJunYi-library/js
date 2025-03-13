<template>
  <div class="VirtualFallsList-page" :class="name">
    <!-- <r-pulldown>
      <div slot="label">label</div>
      <i slot="icon" class="iconfont">&#xe887;</i>
      <div>123456 {{ columns }}</div>
    </r-pulldown> -->
    <button @click="$log(bool)">bool</button>
    <r-grid style="--r-columns: 3">
      <r-pulldown v-model="bool" class="select-pulldown">
        <div slot="label">{{name || '类目'}}</div>
        <div>类目内容 {{ columns }}</div>
        <div>类目内容 {{ columns }}</div>
        <div>类目内容 {{ columns }}</div>
        <div>类目内容 {{ columns }}</div>
        <button @click="name = '牛奶'">确定</button>
        <button @click="name = ''">清楚</button>
      </r-pulldown>

      <r-pulldown>
        <div slot="label">label</div>
        <div> 123456 </div>
        <div> 123456 </div>
        <div> 123456 </div>
        <div> 123456 </div>
        <div> 123456 </div>
      </r-pulldown>

      <r-pulldown>
        <div slot="label">筛选</div>
        <div>筛选内容 {{ columns }}</div>
        <div>筛选内容 {{ columns }}</div>
        <div>筛选内容 {{ columns }}</div>
        <div>筛选内容 {{ columns }}</div>
        <div>筛选内容 {{ columns }}</div>
      </r-pulldown>
    </r-grid>

    <button @click="name = '类目'">columns</button>
  </div>
</template>
<script setup lang="jsx">
import { arrayLoopMap, ListArray } from '@rainbow_ljy/rainbow-js'
import { useRadio2 } from '@rainbow_ljy/v-hooks'
import { ref, render } from 'vue'
import { useFetch } from '@/utils/request'

const name = ref('')
const bool = ref(false)
const arrays = new ListArray()
const List = ref([])
const gap = ref(10)
const columns = ref(4)

function setBool(params) {
  bool.value = params
}

function input(event) {
  console.log(event)
  console.log(bool)
}
</script>

<style>
.my-dialog {
  --r-orientation: top;
}
</style>
