<template>
  <div class="hooks-radio">
    <div>
      <button @click="multipleList.updateSelect([multipleList.list[6], multipleList.list[3]])">
        updateSelect
      </button>
      <button @click="multipleList.updateValue([14, 7])">updateValue</button>
      <button @click="multipleList.updateLabel([`label-${18}`, `label-${8}`])">updateLabel</button>
      <button @click="multipleList.updateIndex([19, 9])">updateIndex</button>
      <button @click="updateList">updateList</button>
      <button @click="multipleList.push(...creates([100, 101]))">push</button>
      <button @click="multipleList.pushed(creates([102, 103]))">pushed</button>
      <button @click="multipleList.unshift(...creates([104, 105]))">unshift</button>
      <button @click="multipleList.unshifted(creates([106, 107]))">unshifted</button>
      <button @click="multipleList.splice(2, 1)">splice 2 1</button>
      <button @click="multipleList.splice(2, 0, ...creates([108, 109]))">splice 2 1 108</button>
      <button @click="multipleList.insert(multipleList.list[2], 1, 1)">insert 2 1</button>
      <button @click="multipleList.insert(multipleList.list[2], 1, 0, ...creates([200, 201]))">
        insert 2 1 200
      </button>
      <button @click="multipleList.insert((el) => el.value === 105, 1, 0, ...creates([202, 203]))">
        自定义insert
      </button>

      <button @click="multipleList.remove(multipleList.list[6], multipleList.list[3])">
        remove
      </button>
      <button @click="multipleList.removed(multipleList.select)">removed</button>
      <button @click="multipleList.pop()">pop</button>
      <button @click="multipleList.shift()">shift</button>
    </div>
    <div>
      <r-grid style="--r-columns: 5; --r-gap: 4px">
        <ElSelect v-model="min" size="small">
          <ElOption :value="0" label="0"></ElOption>
          <ElOption :value="5" label="5"></ElOption>
          <ElOption :value="9" label="9"></ElOption>
          <ElOption :value="11" label="11"></ElOption>
          <ElOption :value="19" label="19"></ElOption>
          <ElOption :value="21" label="21"></ElOption>
          <ElOption :value="29" label="29"></ElOption>
        </ElSelect>
      </r-grid>
      <div>
        <button @click="multipleList.filter(filter)">filter</button>
        <button @click="multipleList.sort(sort)">sort</button>
      </div>
    </div>
    <div>
      <div>value: {{ multipleList.value }}</div>
      <div>label: {{ multipleList.label }}</div>
      <div>index: {{ multipleList.index }}</div>
      <div>select: {{ multipleList.select }}</div>
      <!--  <div>getSelectOfValue {{ multipleList.getSelectOfValue([4, 2, 6]) }}</div>
      <div>getLabelOfValue {{ multipleList.getLabelOfValue([4, 2, 6]) }}</div>
      <div>getIndexOfValue {{ multipleList.getIndexOfValue([4, 2, 6]) }}</div> -->
    </div>
    <ElTable :data="multipleList.list" @sort-change="sortChange">
      <ElTableColumn width="80">
        <template #default="{ row }">
          <ElButton
            size="small"
            :type="multipleList.same(row) ? 'primary' : ''"
            @click="multipleList.onSelect(row)"
            >{{ row.value }}
          </ElButton>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="value" label="value" sortable="custom"></ElTableColumn>
      <ElTableColumn prop="label" label="label"></ElTableColumn>
      <ElTableColumn prop="th" label="th" sortable="custom"></ElTableColumn>
    </ElTable>
    <ElPagination
      layout="total, sizes, prev, pager, next, jumper"
      v-model:current-page="multipleList.currentPage"
      v-model:page-size="multipleList.pageSize"
      :total="multipleList.total"
      @change="changePagin"
    >
    </ElPagination>
  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useVList, useListSelect } from '@rainbow_ljy/v-hooks'
import { computed, onMounted, ref } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElSelect, ElOption, ElPagination } from 'element-plus'

function create(value) {
  return { value, label: `label-${value}`, th: Math.ceil(Math.random() * 100) }
}

function creates(values = []) {
  return values.map((value) => create(value))
}

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(66)
const min = ref(0)

const multipleList = useVList({
  isMultiple: true,
  value: [9, 1],
  currentPage: 1,
  pageSize: 10,
  // label: [`label-${17}`, `label-${15}`],
  // index: [8, 2],
  // filterFun: filter,
  // list: arrayLoopMap(30, create)
})

console.log(multipleList.currentPage)
// console.log(multipleList.pageSize);
// console.log(multipleList.currentPage);

function filter(item, index, arr) {
  return min.value <= item.value
}

function sort(item, next) {
  return next.th - item.th
}

function sortChange({ prop, order }) {
  if (!order) return multipleList.sort(undefined)
  multipleList.sort((item, next) => {
    if (order === 'ascending') return item[prop] - next[prop]
    if (order === 'descending') return next[prop] - item[prop]
  })
}

function updateList() {
  multipleList.updateList(
    arrayLoopMap(50, (value) => ({ value, label: `label-${value}` })),
    'value',
  )
}

function changePagin(params) {
  console.log('changePagin', params)
  multipleList.updateCurrentPage(params)
}

onMounted(() => {
  // multipleList.filter(filter)
})
</script>
