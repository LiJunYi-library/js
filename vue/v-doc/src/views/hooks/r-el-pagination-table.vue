<template>
  <div
    class="r-el-pagination-table"
    :class="[maxHeight === 'auto' && 'r-el-pagination-table-max-height-auto']"
    ref="rElPaginationTable"
    v-on-resize="onResize"
  >
    <div class="r-el-table-box">
      <ElTable
        ref="elTable"
        :data="data"
        v-bind="{ ...$attrs }"
        :max-height="maxH"
        :default-sort="defaultSort"
        @sort-change="sortChange"
      >
        <slot></slot>
        <template #append>
          <RenderState></RenderState>
          <slot name="append"></slot>
        </template>
        <template #empty>
          <div
            v-if="listHook.empty && !listHook.error && !listHook.begin"
            class="r-el-pagination-table-state-empty"
          >
            暂无数据
          </div>
          <div v-else></div>
        </template>
      </ElTable>
    </div>
    <div
      ref="rElPagination"
      class="r-el-pagination-bottom"
      v-if="!listHook.begin"
      v-on-resize="onResize"
    >
      <ElPagination
        layout="total, sizes, prev, pager, next, jumper"
        v-model:current-page="listHook.currentPage"
        v-model:page-size="listHook.pageSize"
        :total="listHook.total"
        v-bind="{ ...$attrs }"
        @size-change="sizeChange"
        @current-change="currentChange"
        @change="paginationChange"
      />
    </div>
  </div>
</template>

<script setup lang="jsx">
import { ref, computed, watch, onMounted } from 'vue'
import { ElTable, ElPagination, ElSkeleton } from 'element-plus'

const props = defineProps({
  listHook: Object,
  sortProp: [String, null],
  sortOrder: [String, null],
  maxHeight: [String, Number],
})

const emits = defineEmits([
  'pageSizeChange',
  'currentPageChange',
  'paginationChange',
  'sortChange',
  'update:sortOrder',
  'update:sortProp',
])

const tMaxH = ref(0)
const rElPaginationTable = ref('rElPaginationTable')
const rElPagination = ref('rElPagination')
const elTable = ref('elTable')
const defaultSort = { prop: props.sortProp, order: props.sortOrder }
onMounted(mounted)
watch(() => [props.sortOrder, props.sortProp], watchSort)
const maxH = computed(() => (props.maxHeight === undefined ? tMaxH.value : props.maxHeight))
const data = computed(() => (props.listHook.error ? [] : props.listHook.list))

function onResize() {
  const pH = rElPaginationTable.value?.offsetHeight ?? 0
  const cH = rElPagination.value?.offsetHeight ?? 0
  tMaxH.value = pH - cH
}

function watchSort() {
  defaultSort.prop = props.sortProp
  defaultSort.order = props.sortOrder
  elTable.value.sort(props.sortProp, props.sortOrder)
}

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
  defaultSort.prop = data.prop
  defaultSort.order = data.order
  emits('update:sortProp', data?.prop)
  emits('update:sortOrder', data?.order)
  emits('sortChange', data, ...arg)
}

function mounted() {}

function RenderState() {
  if (props.listHook.error) {
    return <div class="r-el-pagination-table-state-error">出错了</div>
  }

  if (props.listHook.begin) {
    return (
      <div class="r-el-pagination-table-state-begin">
        <ElSkeleton rows={5} animated />
      </div>
    )
  }

  if (props.listHook.loading) {
    return <div class="r-el-pagination-table-state-loading"></div>
  }
}
</script>

<style lang="scss">
.r-el-pagination-table {
  display: flex;
  flex-direction: column;
  height: 1px;
  flex: 1;
  overflow: hidden;

  &.r-el-pagination-table-max-height-auto {
    flex: none;
    height: auto;
    overflow: unset;
  }

  .r-el-pagination-table-state-error {
    text-align: center;
    height: 200px;
    line-height: 200px;
    color: rgb(255, 0, 0);
  }

  .r-el-pagination-table-state-begin {
  }

  .r-el-pagination-table-state-loading {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 20;
    background: rgba(0, 0, 0, 0.5);
  }

  .r-el-pagination-table-state-empty {
    height: 200px;
    line-height: 200px;
  }

  .el-table__empty-block {
    min-height: auto;
  }

  .el-pagination {
    justify-content: center;
    padding: 6px 0;
  }
}
</style>
