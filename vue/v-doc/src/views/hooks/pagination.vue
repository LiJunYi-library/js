<template>
  <div class="hooks-radio">
    <r-grid style="--r-columns: 2">
      <ElSelect v-model="req.isPass" size="small" clearable>
        <ElOption value="0" label="0"></ElOption>
        <ElOption value="1" label="1"></ElOption>
      </ElSelect>

      <ElSelect v-model="req.modelSearchKeyword" size="small" clearable>
        <ElOption value="小熊巾" label="小熊巾"></ElOption>
        <ElOption value="玻尿酸" label="玻尿酸"></ElOption>
      </ElSelect>
    </r-grid>

    <div>
      <button @click="pList.afreshNextBeginSend()">afreshNextBeginSend</button>
      <button @click="pList.afreshNextSend()">afreshNextSend</button>
      <button @click="pList.invertSelect()">invertSelect</button>
      <button @click="pList.allSelect()">allSelect</button>
    </div>

    <div>
      <div>value: {{ pList.value }}</div>
      <!-- <div>label: {{ pList.label }}</div>
      <div>index: {{ pList.index }}</div> -->
      <!-- <div>select: {{ pList.select }}</div> -->
    </div>

    <ElTable :data="pList.list" @sort-change="sortChange">
      <ElTableColumn width="80">
        <template #header>
          <r-grid style="--r-columns: 3">
            <span class="iconfont" @click="pList.invertSelect()">&#xe60d;</span>
            <span class="iconfont"  @click="pList.allSelect()">&#xe60d;</span>
            <span class="iconfont"  @click="pList.reset()">&#xe60d;</span>
          </r-grid>

        </template>
        <template #default="{ row }">
          <ElButton size="small" :type="pList.same(row) ? 'primary' : ''" @click="pList.onSelect(row)">{{ row.value }}
          </ElButton>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="id" label="value" sortable="custom"></ElTableColumn>
      <ElTableColumn prop="name" label="label"></ElTableColumn>
    </ElTable>
    <ElPagination layout="total, sizes, prev, pager, next, jumper" v-model:current-page="pList.currentPage"
      v-model:page-size="pList.pageSize" :total="pList.total" @current-change="changePagin">
    </ElPagination>
  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useVListPagination } from '@rainbow_ljy/v-hooks'
import { computed, onMounted, ref } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElSelect, ElOption, ElPagination, ElCheckbox } from 'element-plus'
import { SpuFetch, useSpuFetch, useMFetch } from '@/hooks'


const req = ref({
  isPass: "",
  modelSearchKeyword: "",
})


const pList = (() => {
  let list;
  const body = computed(() => ({
    time: 2000,
    ...req.value,
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
    vaule: ["25993"],
    asyncHook,
    isMultiple: true,
    formatterList: (res) => res?.records || [],
    formatterValue: (item) => item?.id,
    formatterLabel: (item) => item?.name,
    updateListArg: 'value'
  })
  return list
})()




function changePagin(currentPage, pageSize) {
  console.log("changePagin");

  pList.nextSend()

}

function sortChange(params) {

}

onMounted(() => {
  pList.afreshNextBeginSend()
})
</script>
