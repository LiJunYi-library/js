<template>
  <div>
    <r-tabs value="2" :class="tabclass">
      <div slot="active" class="item-active">123</div>
      <!-- <template v-for="(item, index) in list" :key="item.value">
        <r-tab-item :value="item" class="item" :class="'item' + index"> {{ item.label }} </r-tab-item>
      </template> -->
      <r-tab-item value="1" class="item" > label1 </r-tab-item>
      <r-tab-item value="2" class="item" :key="2" > label2 </r-tab-item>

    </r-tabs>

    <div>{{ hook.value }}</div>
    <button @click="setH">hook</button>

    <button @click="hook.value = 50 + hook.value">log</button>
  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js';
import { useRadio2 } from '@rainbow_ljy/v-hooks';
import { ref, onMounted ,watch} from 'vue'
import { setTimeoutPromise } from "@rainbow_ljy/rainbow-js";
class List {
  __value = undefined;
  __label = undefined;
  __list = [];
  __index = undefined;
  __select = undefined;
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
    this.init(props);
  }

  init(props = {}) {
    this.value = props.value
    this.label = props.label
    this.list = props.list || []
    this.index = props.index
    this.select = props.select
  }


  updateValue(val) {
    this.value = val;
    this.select = this.list.find(el => el.value === this.value);
    this.label = this.select?.label;
    this.index = this.list.findIndex(el => el.value === this.value);
  }
}

class VList extends List {
  __value = ref();
  __label = ref();
  __list = ref([]);
  __index = ref();
  __select = ref();
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
    if (!this.__value) return;
    this.__value.value = val
  }
  set label(label) {
    if (!this.__label) return;
    this.__label.value = label
  }
  set list(list) {
    if (!this.__list) return;
    this.__list.value = list
  }
  set index(index) {
    if (!this.__index) return;
    this.__index.value = index
  }
  set select(select) {
    if (!this.__select) return;
    this.__select.value = select
  }


  constructor(...args) {
    super(...args);
    this.init(...args)
  }
}




const d = arrayLoopMap(10, (value) => ({
  value,
  label: 'label' + value,
  id: Math.random(),
  title: arrayLoopMap(Math.floor(Math.random() * 60 + 1), () => "瀑布流item").join(""),
}));
const list = ref(d);
const activeVal = ref(list.value[2]);
const index = ref(0);
const tabclass = ref('');



const hook = new VList({ value: 5, list: d });
console.log(hook);

watch(hook.__value,()=>{
  console.log("watch  hook.value");
})

function setH() {
  hook.updateValue(8);
  // hook.value = 10
  console.log(hook);
  tabclass.value = 'my-tab'
  // activeVal.value.label='newlabel--'
}


</script>

<style scoped lang="scss">
.item {
  padding: 10px;
  margin: 0 10px;
  background: rgba(255, 255, 0, 0.5);
}
.item-active{
  width: 100%;
  height: 100%;
  background: rgba(0, 255, 0, 0.5);
}

.my-tab{
  .item {
  padding: 20px;
  margin: 0 5px;
  background: rgba(255, 100, 0, 0.5);
}
.item-active{
  width: 100%;
  height: 100%;
  background: rgba(100, 0, 255, 0.5);
}
}
</style>
