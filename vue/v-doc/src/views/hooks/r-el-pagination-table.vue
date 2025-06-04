<template>
  <div class="r-el-pagination-table" ref="rElPaginationTable">
    <div class="r-el-table-box" ref="rElTableBox">
      <ElTable ref="elTable" :data="listHook.list" v-bind="{ ...$attrs }" :max-height="rElTableBox?.offsetHeight"
        :default-sort="defaultSort" @sort-change="sortChange">
        <slot></slot>
      </ElTable>
    </div>
    <div ref="rElPagination">
      <ElPagination layout="total, sizes, prev, pager, next, jumper" v-model:current-page="listHook.currentPage"
        v-model:page-size="listHook.pageSize" :total="listHook.total" v-bind="{ ...$attrs }" @size-change="sizeChange"
        @current-change="currentChange" @change="paginationChange" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElTable, ElPagination } from 'element-plus'
const props = defineProps({ listHook: Object, sortProp: [String, null], sortOrder: [String, null] })
const emits = defineEmits(['pageSizeChange', 'currentPageChange',
  'paginationChange', 'sortChange', 'update:sortOrder', 'update:sortProp'])
const rElTableBox = ref('rElTableBox')
const rElPaginationTable = ref('rElPaginationTable')
const rElPagination = ref('rElPagination')
const elTable = ref('elTable')
const defaultSort = { prop: props.sortProp, order: props.sortOrder }
const maxHeight = computed(() => {
  rElPaginationTable?.offsetHeight
  // rElTableBox?.offsetHeight
  //  :max-height="rElTableBox?.offsetHeight"
})

watch(
  () => [props.sortOrder, props.sortProp],
  () => {
    defaultSort.prop = props.sortProp;
    defaultSort.order = props.sortOrder;
    elTable.value.sort(props.sortProp, props.sortOrder)
  }
)

function sizeChange(...arg) {
  emits('pageSizeChange', ...arg)
}

function currentChange(...arg) {
  emits('currentPageChange', ...arg)
}

function paginationChange(...arg) {
  emits('paginationChange', ...arg)
}

function sortChange(data, ...arg) {
  if (defaultSort.prop === data.prop && defaultSort.order === data.order) return
  defaultSort.prop = data.prop;
  defaultSort.order = data.order;
  emits('update:sortProp', data?.prop)
  emits('update:sortOrder', data?.order)
  emits('sortChange', data, ...arg)
}
</script>

<style lang="scss">
.r-el-pagination-table {
  display: flex;
  flex-direction: column;
  height: 1px;
  flex: 1;
  overflow: hidden;

  .r-el-table-box {
    height: 1px;
    flex: 1;
    overflow: hidden;
  }

  .el-pagination {
    justify-content: center;
    padding: 6px 0;
  }
}
</style>
