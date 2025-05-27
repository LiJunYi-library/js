<template>
  <div class="hooks-radio">
    <div>
      <button @click="multipleList.updateSelect([multipleList.list[6], multipleList.list[3]])">updateSelect</button>
      <button @click="multipleList.updateValue([14, 7])">updateValue</button>
      <button @click="multipleList.updateLabel([`label-${18}`, `label-${8}`])">updateLabel</button>
      <button @click="multipleList.updateIndex([19, 9])">updateIndex</button>
      <button @click="updateList">updateList</button>
    </div>
    <div>
      <div> value: {{ multipleList.value }}</div>
      <div> label: {{ multipleList.label }}</div>
      <div> index: {{ multipleList.index }}</div>
      <div> select: {{ multipleList.select }}</div>
      <div>getSelectOfValue {{ multipleList.getSelectOfValue([4, 2, 6]) }}</div>
      <div>getLabelOfValue {{ multipleList.getLabelOfValue([4, 2, 6]) }}</div>
      <div>getIndexOfValue {{ multipleList.getIndexOfValue([4, 2, 6]) }}</div>
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
import { useListMultiple, useListSelect } from '@rainbow_ljy/v-hooks'
import { computed, onMounted, ref } from 'vue'
import { ElTable, ElTableColumn, ElButton } from "element-plus"

const multipleList = useListSelect({
  isMultiple: true,
  value: [9, 1],
  // label: [`label-${17}`, `label-${15}`],
  // index: [8, 2],
  list: arrayLoopMap(30, (value) => ({ value, label: `label-${value}` }))
})

console.log(multipleList);


function updateList() {
  multipleList.updateList(arrayLoopMap(50, (value) => ({ value, label: `label-${value}` })), 'value')
}

</script>
