<template>
  <div class="radio-layout-tabs-demo">
    <!-- <r-tabs value="3" @change="change">
      <r-tab-item value="1" class="item"> label1 </r-tab-item>
      <div slot="active" class="item-active">123</div>
      <r-tab-item value="2" class="item"> label2 </r-tab-item>
      <r-tab-item value="3" class="item"> label3 </r-tab-item>
      <r-tab-item value="4" class="item" v-if="bool"> label4 </r-tab-item>
      <r-tab-item value="5" class="item"> label5 </r-tab-item>
    </r-tabs> -->
    <div>------------------------------------------------</div>
    <!-- <r-tabs :value="Radio2.value" :class="tabclass" @change="change">
      <template v-for="(item, index) in Radio2.list" :key="item.value">
        <r-tab-item trigger="none" :value="item.value" class="item" :class="'item' + index"
          @click="Radio2.onSelect(item, index)">
          {{ item.label }}
        </r-tab-item>
      </template>
<div slot="active" class="item-active">123</div>
</r-tabs> -->
    <div>------------------------------------------------</div>
    <!-- <r-tabs :value="Radio2.value" class="r-tabs-vertical vertical-tab" @change="change">
      <template v-for="(item, index) in Radio2.list" :key="item.value">
        <r-tab-item trigger="none" :value="item.value" class="item" :class="'item' + index"
          @click="Radio2.onSelect(item, index)">
          {{ item.label }}
        </r-tab-item>
      </template>
      <div slot="active" class="item-active">123</div>
    </r-tabs> -->
    <div>------------------------------------------------</div>
    <!-- <VRTabs :listHook="Radio2" @change="change"></VRTabs> -->
    <div>------------------------------------------------</div>
    <!-- <VRTabs :listHook="Radio2" @change="change">
      <template #default="{ item, index }">
        <div>i-{{ index }}v-{{ item.value }}</div>
      </template>
      <template #active>
        <div slot="active" class="item-active">123</div>
      </template>
    </VRTabs> ref="parent" draggable-->

    <div class="select-list hide-scrollbar">
      <VRRenderList :listHook="Radio2" @disabledTrigger="change">
        <template #item="{ item, index }">
          <div :class="[bool && 'parent-item']"></div>
        </template>
      </VRRenderList>
    </div>

    <!-- <VRRenderList :listHook="Radio2" @disabledTrigger="change">
      <div ref="parent" class="ppppp hide-scrollbar"></div>
      <template #item="{ item, index }">
        <div :class="[bool && 'parent-item']">{{ item.title }}</div>
      </template>
      <template #children>
        <div class="item-active">123</div>
      </template>
    </VRRenderList>

    <r-tab class="parent" :value="Radio2.value">
      <VRRenderList :listHook="Radio2" @disabledTrigger="change">
        <template #item="{ item, index }">
          <r-tab-item :value="item.value" > ***{{ item.value }}*** </r-tab-item>
        </template>
      </VRRenderList>
      <div slot="active" class="item-active">123</div>
    </r-tab> -->

    <r-marquee>
      <div style="margin: 0 12px;"> aaaaaaaaaaaaaaaa </div>
      <div style="margin: 0 12px;" @click="$log('Radio2')"> bbbbbbbbbbbbbbbb </div>
      <div style="margin: 0 12px;">cccccccccccccccccccccccccc</div>
      <div style="margin: 0 12px;">dddddddddddddddddddddddddd</div>
      <!--<div style="margin: 0 12px;">eeeeeeeeeeeeeeeeeeeeeeeeee</div> -->
    </r-marquee>
    <!-- <TTT></TTT> -->
    <div>123</div>
    <div>123</div>
    <div>123</div>
    <div>123</div>
    <div>Radio2.value {{ Radio2.value }}</div>
    <div>bool.value {{ bool }}</div>
    <!-- <div style="width: 30px; font-size: 80px; height: 1500px; word-wrap: break-word">123456789</div> -->
    <button @click="bool = !bool">bool</button>
    <button @click="Radio2.updateList(d2, true)">updateList</button>
    <button @click="$log(Radio2,)">log</button>
  </div>
</template>
<script setup lang="jsx">
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useListRadio, useListMultiple, useVList } from '@rainbow_ljy/v-hooks'
import { ref, onMounted, renderList, h, defineComponent, cloneVNode } from 'vue'
import { setTimeoutPromise } from '@rainbow_ljy/rainbow-js'
import { VRRenderList } from '@rainbow_ljy/v-views'
// import TTT from './ttt'
// console.log(TTT);

// list 布局  支持 滚动居中 activite定位 拖拽修改顺序
HTMLElement.prototype.value__ = (function () {
  console.log("this", this);
  return 123
})()

function ET(params, mctx) {
  return <div class='ET'>{mctx.slots?.default?.()}</div>
}

const d = arrayLoopMap(20, (value) => ({
  value,
  label: 'label' + value,
  id: Math.random(),
  title: arrayLoopMap(Math.floor(Math.random() * 4 + 1), () => '流').join(''),
}))
const d2 = arrayLoopMap(5, (value) => ({
  value,
  label: 'label' + value,
  id: Math.random(),
  title: arrayLoopMap(Math.floor(Math.random() * 4 + 1), () => '流').join(''),
}))
const list = ref(d)
const activeVal = ref(list.value[2])
const index = ref(0)
const parent = ref('parent')
const bool = ref(true)

const Radio2 = useVList({
  value: [3, 5],
  list: d,
  isMultiple: true,
  formatterDisabled: (item) => {
    return item?.value === 8
  }
})

function change(params) {
  console.log('change', parent)
  console.log(parent.value)
}

function setH() {
  Radio2.updateValue(1)
}
</script>

<style lang="scss">
.select-item {
  cursor: default;
  padding: 0 15px;
  // background: rgba(255, 230, 0, 0.696);
}

.select-item-checked {
  // color: rgba(255, 255, 255, 0.255);
  // background: rgba(0, 0, 0, 0.255);
  font-size: 20px;
}

.parent-item.select-item-checked {
  font-size: 50px;
}

.select-item-disabled {
  cursor: not-allowed;
}

.select-active {
  background: rgba(0, 253, 202, 0.25);
  z-index: -1;
}

.select-active-transition {
  transition: 0.25s;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.radio-layout-tabs-demo {
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


  r-tab {
    --r-trigger: none;
  }

  .select-list {
    display: flex;
    max-width: 100%;
    overflow: auto;
    position: relative;
    touch-action: pan-x;
  }


}
</style>
