<template>
  <div class="hooks-radio">
    <div>
      <button @click="radioList.updateSelect(radioList.list[9])">updateSelect</button>
      <button @click="radioList.updateValue(++radioList.value)">updateValue</button>
      <button @click="radioList.updateLabel(`label-${3}`)">updateLabel</button>
      <button @click="radioList.updateIndex(--radioList.index)">updateIndex</button>
      <button @click="updateList">updateList</button>
    </div>
    <div>
      <div> value: {{ radioList.value }}</div>
      <div> label: {{ radioList.label }}</div>
      <div> index: {{ radioList.index }}</div>
      <div> select: {{ radioList.select }}</div>
    </div>
    <ElTable :data="radioList.list">
      <ElTableColumn width="80">
        <template #default="{ row }">
          <ElButton size="small" :type="radioList.same(row) ? 'primary' : ''" @click="radioList.onSelect(row)">{{
            row.value }}
          </ElButton>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="value" label="value"></ElTableColumn>
      <ElTableColumn prop="label" label="label"></ElTableColumn>
    </ElTable>
  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useListRadio } from '@rainbow_ljy/v-hooks'
import { computed, onMounted, ref } from 'vue'
import { ElTable, ElTableColumn, ElButton } from "element-plus"

const radioList = useListRadio({
  value: 8,
  list: arrayLoopMap(30, (value) => ({ value, label: `label-${value}` }))
})

function updateList() {
  radioList.updateList(arrayLoopMap(50, (value) => ({ value, label: `label-*-${value}` })))
  console.log(radioList)
}

</script>
