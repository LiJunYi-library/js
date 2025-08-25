<template>
  <div
    class="r-el-pagination-table"
    :class="[
      boolAutoFlex(props.height, 'flex-auto-height', ''),
      boolAutoFlex(props.maxHeight, 'flex-auto-height', ''),
      props.class,
    ]"
    ref="rElPaginationTable"
    v-on-resize.height="onResize"
    :style="[props.style, innerStyle]"
  >
    <div class="r-el-table-box">
      <ElTable
        ref="elTable"
        :data="data"
        v-bind="{ ...$attrs }"
        :height="tableHeight"
        :max-height="tableMaxHeight"
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
      v-if="!listHook.begin && !listHook.error"
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
import { ref, computed, watch, onMounted, useAttrs } from 'vue'
import { ElTable, ElPagination, ElSkeleton } from 'element-plus'

const attrs = useAttrs()

const props = defineProps({
  listHook: Object,
  sortProp: [String, null],
  sortOrder: [String, null],
  maxHeight: [String, Number],
  height: [String, Number],
  skeletonRows: { type: Number, default: 10 },
  style: [String, Object, Array],
  class: [String, Object, Array],
})

const emits = defineEmits([
  'pageSizeChange',
  'currentPageChange',
  'paginationChange',
  'sortChange',
  'update:sortOrder',
  'update:sortProp',
])

const elTable = ref('elTable')
const rElPaginationTable = ref('rElPaginationTable')
const PTH = ref(0)
const rElPagination = ref('rElPagination')
const PH = ref(0)
const CH = ref(0)
const defaultSort = { prop: props.sortProp, order: props.sortOrder }
watch(() => [props.sortOrder, props.sortProp], watchSort)
const data = computed(() => (props.listHook.error ? [] : props.listHook.list))
const innerStyle = computed(() => ({ maxHeight: props.maxHeight, height: props.height }))
const boolAutoFlex = (v, a, b) => (v === 'flex-auto-height' ? a : b)
const tableMaxHeight = computed(() => {
  if (props.maxHeight === undefined) return undefined
  return boolAutoFlex(props.maxHeight, `${CH.value}px`, `calc( ${props.maxHeight} - ${PH.value}px)`)
})
const tableHeight = computed(() => {
  if (props.height === undefined) return undefined
  return boolAutoFlex(props.height, `${CH.value}px`, `calc( ${props.height} - ${PH.value}px)`)
})
onMounted(mounted)

function onResize() {
  PTH.value = rElPaginationTable.value?.offsetHeight ?? 0
  PH.value = rElPagination.value?.offsetHeight ?? 0
  CH.value = PTH.value - PH.value
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

async function onErrClick(...arg) {
  if (attrs?.onErrClick) {
    attrs.onErrClick(...arg)
    return
  }
  props.listHook?.afreshNextSend?.()
}

function mounted() {}

function RenderState() {
  if (props.listHook.error) {
    return (
      <div class="r-el-pagination-table-state-error">
        <span onClick={onErrClick}>出错了</span>
      </div>
    )
  }

  if (props.listHook.begin) {
    return (
      <div class="r-el-pagination-table-state-begin">
        <ElSkeleton rows={props.skeletonRows} animated />
      </div>
    )
  }

  if (props.listHook.loading) {
    return [
      <div class="r-el-pagination-table-state-loading"></div>,
      props.listHook?.list?.length === 0 && !props.listHook.begin && !props.listHook.error && (
        <div class="r-el-pagination-table-state-loading-placeholder"></div>
      ),
    ]
  }
}
</script>

<style lang="scss">
.r-el-pagination-table {
  &.flex-auto-height {
    display: flex;
    flex-direction: column;
    height: 1px;
    flex: 1;
    overflow: hidden;
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

  .r-el-pagination-table-state-loading-placeholder {
    height: 200px;
    line-height: 200px;
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
