<template>
  <div class="hooks-pagination">
    {{ aaa.a }} <button @click="aaa.a++">add</button>
    <div>
      <r-grid style="--r-columns: 2">
        <ElSelect v-model="req.isPass" size="small" clearable>
          <ElOption value="0" label="0"></ElOption>
          <ElOption value="1" label="1"></ElOption>
          <ElOption value="5" label="5"></ElOption>
        </ElSelect>

        <ElSelect v-model="req.modelSearchKeyword" size="small" clearable>
          <ElOption value="小熊巾" label="小熊巾"></ElOption>
          <ElOption value="玻尿酸" label="玻尿酸"></ElOption>
          <ElOption value="哇哇哇哇哇" label="哇哇哇哇哇"></ElOption>
        </ElSelect>
      </r-grid>

      <div>
        <button @click="pList.afreshNextBeginSend()">afreshNextBeginSend</button>
        <button @click="pList.afreshNextSend()">afreshNextSend</button>
        <button @click="errorSend()">errorSend</button>
        <button @click="pList.invertSelect()">invertSelect</button>
        <button @click="pList.allSelect()">allSelect</button>
        <button @click="$log(pList)">look</button>
      </div>

      <div>
        <div v-on-intersection="intersection">value: {{ pList.value }}</div>
        <div>label: {{ pList.label }}</div>
        <div>index: {{ pList.index }}</div>
        <!-- <div>select: {{ pList.select }}</div>  size="small"-->
      </div>
    </div>

    <RPaginationTable
      :listHook="pList"
      max-height="flex-auto-height"
      :class="['44555', 'ccccc']"
      v-model:sortProp="req.sortProp"
      v-model:sortOrder="req.sortOrder"
      border
      @currentPageChange="changePagin"
      @sort-change="sortChange"
    >
      <ElTableColumn width="80">
        <template #header>
          <r-grid style="--r-columns: 3">
            <span class="iconfont" @click="pList.invertSelect()">&#xe60d;</span>
            <span class="iconfont" @click="pList.allSelect()">&#xe60d;</span>
            <span class="iconfont" @click="pList.reset()">&#xe60d;</span>
          </r-grid>
        </template>
        <template #default="{ row }">
          <ElButton
            size="small"
            :type="pList.same(row) ? 'primary' : ''"
            @click="pList.onSelect(row)"
          />
        </template>
      </ElTableColumn>
      <ElTableColumn prop="id" label="id" sortable="custom"></ElTableColumn>
      <ElTableColumn prop="name" label="name" width="180" sortable="custom"></ElTableColumn>
      <ElTableColumn prop="spuSearchName" label="spuSearchName" sortable="custom"></ElTableColumn>

      <template #empty>
        <div>emptyemptyempty</div>
      </template>
    </RPaginationTable>
  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useVListPagination } from '@rainbow_ljy/v-hooks'
import { computed, onMounted, customRef, reactive } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElSelect,
  ElOption,
  ElPagination,
  ElCheckbox,
} from 'element-plus'
import { useSpuFetch, useMFetch } from '@/hooks'
import RPaginationTable from './r-el-pagination-table.vue'

 function useLocalVal(key, defaultValue) {
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        const localVal = window.localStorage.getItem(key)
        if (localVal === null) return defaultValue
        try {
          return JSON.parse(localVal)
        } catch (error) {
          return localVal
        }
      },
      set(newValue) {
        // console.log('set');

        window.localStorage.setItem(key, JSON.stringify(newValue))
        trigger()
      },
    }
  })
}

const aaa = useLocalVal('aaa', {a:10})
aaa.value =  {a:10}

const req = reactive({
  isPass: '',
  modelSearchKeyword: '',
  sortOrder: 'descending',
  sortProp: 'name',
})

const pList = (() => {
  let list
  const body = computed(() => ({
    time: 2000,
    ...req,
    page: list.currentPage,
    rows: list.pageSize,
    // total: 100,
    // list: arrayLoopMap(3, () => ({ id: Math.random(), name: Math.random() }))
  }))

  const asyncHook = useSpuFetch({
    url: '/spu/list',
    method: 'post',
    body,
  })

  list = useVListPagination({
    vaule: ['25993'],
    asyncHook,
    isMultiple: true,
    formatterList: (res) => res?.records || [],
    formatterValue: (item) => item?.id,
    formatterLabel: (item) => item?.name,
    updateListArg: 'value',
  })
  return list
})()

function changePagin(currentPage, pageSize) {
  console.log('changePagin  ---', req)
  pList.nextSend()
}

function sortChange(params) {
  console.log('sortChange  ---')
  console.log(params)
  pList.nextSend()
}

function errorSend() {
  //afreshNextBeginSend  afreshNextSend  nextSend
  pList.afreshNextSend({ url: '/spu/list2' })
  // pList.loading = true
}

function intersection(params) {
  console.log('intersection  ---', params)
}

onMounted(() => {
  pList.afreshNextBeginSend()
})
</script>

<style lang="scss" scoped>
.hooks-pagination {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
}
</style>
