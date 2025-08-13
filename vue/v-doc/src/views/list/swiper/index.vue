<template>
  <div>
    <template>
      <li class="list-item">{{ Radio2.value }}</li>
    </template>
    <VRTabs :listHook="Radio2"></VRTabs>
    <r-swiper v-model="Radio2.value">
      <template v-for="(item, index) in Radio2.list" :key="item.value">
        <r-swiper-item :value="item.value" class="item">
          <div>{{ item.label }}</div>
          <div>{{ item.label }}</div>
          <div>{{ item.label }}</div>
        </r-swiper-item>
      </template>
    </r-swiper>
  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useRadio2 } from '@rainbow_ljy/v-hooks'
import { ref, onMounted, watch } from 'vue'
import { setTimeoutPromise } from '@rainbow_ljy/rainbow-js'
import { VRTabs } from '@rainbow_ljy/v-views'

const d = arrayLoopMap(5, (value) => ({
  value,
  label: 'label' + value,
  id: Math.random(),
  title: arrayLoopMap(Math.floor(Math.random() * 60 + 1), () => '瀑布流item').join(''),
}))
const list = ref(d)
const activeVal = ref(list.value[2])
const index = ref(0)
const tabclass = ref('')
const Radio2 = useRadio2({ value: 3, list: d })
console.log(Radio2)

function change(params) {
  console.log('change')
  console.log(params)
}
</script>

<style scoped lang="scss"></style>
