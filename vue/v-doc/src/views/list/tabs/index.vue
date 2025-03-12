<template>
  <div>
    <r-tabs value="3" @change="change">
      <r-tab-item value="1" class="item"> label1 </r-tab-item>
      <r-tab-item value="2" class="item"> label2 </r-tab-item>
      <r-tab-item value="3" class="item"> label3 </r-tab-item>
      <r-tab-item value="4" class="item" v-if="bool"> label4 </r-tab-item>
      <r-tab-item value="5" class="item"> label5 </r-tab-item>
      <div slot="active" class="item-active">123</div>
    </r-tabs>
    <div>------------------------------------------------</div>
    <r-tabs :value="Radio2.value" :class="tabclass" @change="change">
      <template v-for="(item, index) in Radio2.list" :key="item.value">
        <r-tab-item trigger="none" :value="item.value" class="item" :class="'item' + index"
          @click="Radio2.onSelect(item, index)">
          {{ item.label }}
        </r-tab-item>
      </template>
      <div slot="active" class="item-active">123</div>
    </r-tabs>
    <div>------------------------------------------------</div>
    <VRTabs :listHook="Radio2" @change="change"></VRTabs>
    <div>------------------------------------------------</div>
    <VRTabs :listHook="Radio2" @change="change">
      <template #default="{ item, index }">
        <div>i-{{ index }}v-{{ item.value }}</div>
      </template>
      <template #active>
        <div slot="active" class="item-active">123</div>
      </template>
    </VRTabs>

    <div>123</div>
    <div>123</div>
    <div>123</div>
    <div>123</div>
    <div>Radio2.value {{ Radio2.value }}</div>

    <div>{{ hook.value }}</div>
    <button @click="setH">hook</button>
    <div style="width: 30px; font-size: 80px; height: 1500px; word-wrap: break-word">123456789</div>
    <button @click="bool=!bool">bool</button>

  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useRadio2 } from '@rainbow_ljy/v-hooks'
import { ref, onMounted, watch } from 'vue'
import { setTimeoutPromise } from '@rainbow_ljy/rainbow-js'
import { VRTabs } from '@rainbow_ljy/v-view'
class List {
  __value = undefined
  __label = undefined
  __list = []
  __index = undefined
  __select = undefined
  get value() {
    return this.__value
  }
  set value(val) {
    this.__value = val
  }
  get label() {
    return this.__label
  }
  set label(label) {
    this.__label = label
  }
  get list() {
    return this.__list
  }
  set list(list) {
    this.__list = list
  }
  get index() {
    return this.__index
  }
  set index(index) {
    this.__index = index
  }
  get select() {
    return this.__select
  }
  set select(select) {
    this.__select = select
  }

  constructor(props = {}) {
    this.init(props)
  }

  init(props = {}) {
    this.value = props.value
    this.label = props.label
    this.list = props.list || []
    this.index = props.index
    this.select = props.select
  }

  updateValue(val) {
    this.value = val
    this.select = this.list.find((el) => el.value === this.value)
    this.label = this.select?.label
    this.index = this.list.findIndex((el) => el.value === this.value)
  }
}

class VList extends List {
  __value = ref()
  __label = ref()
  __list = ref([])
  __index = ref()
  __select = ref()
  get value() {
    return this.__value?.value
  }
  get label() {
    return this.__label?.value
  }
  get list() {
    return this.__list?.value
  }
  get index() {
    return this.__index?.value
  }
  get select() {
    return this.__select?.value
  }
  set value(val) {
    if (!this.__value) return
    this.__value.value = val
  }
  set label(label) {
    if (!this.__label) return
    this.__label.value = label
  }
  set list(list) {
    if (!this.__list) return
    this.__list.value = list
  }
  set index(index) {
    if (!this.__index) return
    this.__index.value = index
  }
  set select(select) {
    if (!this.__select) return
    this.__select.value = select
  }

  constructor(...args) {
    super(...args)
    this.init(...args)
  }
}

// __value
// __label
// __list
// __index
// __select
// __currentPage
// __pageSize
// __total
// 单选 多选
// 列表 曾 删 改 查 排序 单选 多选
// 列表 曾 删 改 查 排序 单选 多选 分页
// 列表 曾 删 改 查 排序 单选 多选 分页加载

const d = arrayLoopMap(5, (value) => ({
  value,
  label: 'label' + value,
  id: Math.random(),
  title: arrayLoopMap(Math.floor(Math.random() * 60 + 1), () => '瀑布流item').join(''),
}))
const list = ref(d)
const activeVal = ref(list.value[2])
const index = ref(0)
const tabclass = ref('')
const bool = ref(true)

const Radio2 = useRadio2({ value: 3, list: d })

const hook = new VList({ value: 5, list: d })
console.log(Radio2)
// debugger
watch(hook.__value, () => {
  console.log('watch  hook.value')
})

function change(params) {
  console.log('change')
  console.log(params)
}

function setH() {
  // hook.updateValue(8)
  // hook.value = 10
  // console.log(Radio2)
  // tabclass.value = 'my-tab'
  Radio2.updateValue(1)

  // activeVal.value.label='newlabel--'
}
</script>

<style scoped lang="scss">
.item {
  padding: 10px;
  margin: 0 10px;
  background: rgba(255, 255, 0, 0.5);
}

.item-active {
  width: 100%;
  height: 100%;
  background: rgba(0, 255, 0, 0.5);
}

.r-tab-item-act {
  font-size: 30px;
}

.my-tab {
  .item {
    padding: 20px;
    margin: 0 5px;
    background: rgba(255, 100, 0, 0.5);
  }

  .item-active {
    width: 100%;
    height: 100%;
    background: rgba(100, 0, 255, 0.5);
  }
}
</style>
