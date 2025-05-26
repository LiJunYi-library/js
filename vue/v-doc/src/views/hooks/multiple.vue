<template>
  <div class="hooks-radio">
    <div>
      <button @click="multipleList.updateSelect(multipleList.list[9])">updateSelect</button>
      <button @click="multipleList.updateValue(++multipleList.value)">updateValue</button>
      <button @click="multipleList.updateLabel(`label-${3}`)">updateLabel</button>
      <button @click="multipleList.updateIndex(--multipleList.index)">updateIndex</button>
      <button @click="updateList">updateList</button>
    </div>
    <div>
      <div> value: {{ multipleList.value }}</div>
      <div> label: {{ multipleList.label }}</div>
      <div> index: {{ multipleList.index }}</div>
      <div> select: {{ multipleList.select }}</div>
    </div>
    <ElTable :data="multipleList.list">
      <ElTableColumn width="80">
        <template #default="{ row }">
          <ElButton size="small" :type="multipleList.same(row) ? 'primary' : ''" @click="multipleList.onSelect(row)">{{
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
import { useListMultiple } from '@rainbow_ljy/v-hooks'
import { computed, onMounted, ref } from 'vue'
import { ElTable, ElTableColumn, ElButton } from "element-plus"

const multipleList = useListMultiple({
  value: 8,
  list: arrayLoopMap(30, (value) => ({ value, label: `label-${value}` }))
})

function updateList() {
  multipleList.updateList(arrayLoopMap(50, (value) => ({ value, label: `label-*-${value}` })))
}

</script>
