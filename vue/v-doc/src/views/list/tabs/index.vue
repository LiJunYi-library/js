<template>
  <div>
    <div>
      <button @click="bool = !bool">bool</button>
      <button @click="$log(activeVal)">look</button>
    </div>
    <r-tab v-model="activeVal" @change="change">
      <r-tab-item value="1" class="page-item" draggable="true"> label1 </r-tab-item>
      <r-tab-item value="2" class="page-item" draggable="true"> label2 </r-tab-item>
      <r-tab-item value="3" class="page-item" draggable="true"> label3 </r-tab-item>
      <r-tab-item value="4" class="page-item" draggable="true" v-if="bool"> label4 </r-tab-item>
      <r-tab-item value="5" class="page-item" draggable="true"> label5 </r-tab-item>
      <r-tab-item value="6" class="page-item" draggable="true"> label6 </r-tab-item>
      <r-tab-item value="7" class="page-item" draggable="true"> label7 </r-tab-item>
      <r-tab-item value="8" class="page-item" draggable="true"> label8 </r-tab-item>
      <!-- <div slot="active" class="item-active">123</div> -->
    </r-tab>
    <div>------------------------------------------------</div>
    <r-tab :value="4" :class="tabclass" @change="change">
      <template v-for="(item, index) in Radio2.list" :key="item.value">
        <r-tab-item
          trigger="none"
          :value="item.value"
          class="item"
          :class="[Radio2.same(item, index) && 'item-same']"
          @click="Radio2.onSelect(item, index)"
        >
          {{ item.label }}
        </r-tab-item>
      </template>
      <div slot="active" class="r-tab-active-line" />
    </r-tab>
    <div>------------------------------------------------</div>
    <r-tab :value="Radio2.value.at(-1)" class="r-tab-vertical vertical-tab" @change="change">
      <template v-for="(item, index) in Radio2.list" :key="item.value">
        <r-tab-item
          trigger="none"
          :value="item.value"
          class="item"
          :class="[Radio2.same(item, index) && 'item-same']"
          @click="Radio2.onSelect(item, index)"
        >
          {{ item.label }}
        </r-tab-item>
      </template>
      <div slot="active" class="item-active">123</div>
    </r-tab>
    <div>------------------------------------------------</div>
    <VRTabs :listHook="Radio2" @change="change">
      <template #active>
        <div slot="active" class="item-active">123</div>
      </template>
    </VRTabs>
    <div>------------------------------------------------</div>
    <VRTabs :listHook="Radio2" @change="change">
      <template #default="{ item, index }">
        <div>i-{{ index }}v-{{ item.value }}</div>
      </template>
      <template #active>
        <div slot="active" class="r-tab-active-line"></div>
      </template>
    </VRTabs>

    <div>123</div>
    <div>123</div>
    <div>123</div>
    <div>123</div>
    <div>Radio2.value {{ Radio2.value }}</div>

    <button @click="setH">hook</button>
  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useRadio2, useMultiple2 } from '@rainbow_ljy/v-hooks'
import { ref, onMounted, watch } from 'vue'
import { setTimeoutPromise } from '@rainbow_ljy/rainbow-js'
import { VRTabs } from '@rainbow_ljy/v-views'

const d = arrayLoopMap(8, (value) => ({
  value,
  label: 'label' + value,
  id: Math.random(),
  title: arrayLoopMap(Math.floor(Math.random() * 60 + 1), () => '瀑布流item').join(''),
}))
const list = ref(d)
const activeVal = ref('4')
const index = ref(0)
const tabclass = ref('')
const bool = ref(true)

const Radio2 = useMultiple2({ value: [4], list: d })

function change(params) {
  console.log('change')
  console.log(params.value)
  console.log(activeVal)
  activeVal.value = params.value + ''
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
.page-item {
  // min-width: 100vw;
  // height: 60px;
  padding: 10px;
  margin: 0 10px;
  background: rgba(255, 255, 0, 0.5);
  width: 100px;
}
.item {
  padding: 10px;
  margin: 0 10px;
  background: rgba(255, 255, 0, 0.5);
  width: 100px;
}

.item-active {
  width: 100%;
  height: 100%;
  background: rgba(0, 255, 0, 0.5);
}

.item-same {
  color: white;
}

.r-tab-item-act {
  font-size: 30px;
}

.vertical-tab {
  width: 150px;
  height: 200px;
  --r-trigger: none;
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
