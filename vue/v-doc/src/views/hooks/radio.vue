<template>
  <div class="hooks-radio">
    <div>
      <button @click="tab.updateValue(++tab.value)">updateValue</button>
    </div>
    <div>
      <div> value: {{ tab.value }}</div>
      <div> label: {{ tab.label }}</div>
      <div> index: {{ tab.index }}</div>
      <div> select: {{ tab.select }}</div>
    </div>

    <div>
      <button @click="tab2.updateSelect(tab2.list[9])">updateSelect</button>
      <button @click="tab2.updateValue(++tab2.value)">updateValue</button>
      <button @click="tab2.updateLabel(`label-${3}`)">updateLabel</button>
      <button @click="tab2.updateIndex(--tab2.index)">updateIndex</button>
    </div>
    <div>
      <div> value: {{ tab2.value }}</div>
      <div> label: {{ tab2.label }}</div>
      <div> index: {{ tab2.index }}</div>
      <div> select: {{ tab2.select }}</div>
    </div>
  </div>
</template>
<script setup>
import { arrayLoopMap, listRadio } from '@rainbow_ljy/rainbow-js'
import { VRPaginationLoading } from '@rainbow_ljy/v-views'
import { VListRadio, useListRadio } from '@rainbow_ljy/v-hooks'
import { computed, onMounted, ref } from 'vue'

const tab = new VListRadio({
  value: 11,
  list: arrayLoopMap(20, (value) => ({ value, label: `label-${value}` }))
})
tab.updateList(arrayLoopMap(30, (value) => ({ value, label: `label-*-${value}` })), { value: 12 })




const tab2 = useListRadio({
  value: 20,
  list: arrayLoopMap(30, (value) => ({ value, label: `label-${value}` }))
})

</script>
