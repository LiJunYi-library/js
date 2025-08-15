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
    </VRTabs> -->
    <VRRenderList :listHook="Radio2" @triggerDisabled="change">
      <template #item="{ item, index }">
        <div :class="[bool && 'parent-item']" v-if="index"></div>
      </template>
    </VRRenderList>

    <r-tab class="parent" :value="Radio2.value">
      <VRRenderList :listHook="Radio2" @triggerDisabled="change">
        <template #item="{ item, index }">
          <r-tab-item :value="item.value" />
        </template>
      </VRRenderList>
      <div slot="active" class="item-active">123</div>
    </r-tab>

    <r-marquee>
      <div>我的顺丰到付方法我的顺丰到付方法我的顺丰到付方法我的顺丰到付方法我的顺丰到付方法</div>
      <div>我的顺丰到付方法我的顺丰到付方法我的顺丰到付方法我的顺丰到付方法我的顺丰到付方法</div>
      <div>我的顺丰到付方法我的顺丰到付方法我的顺丰到付方法我的顺丰到付方法我的顺丰到付方法</div>
      <div>我的顺丰到付方法我的顺丰到付方法我的顺丰到付方法我的顺丰到付方法我的顺丰到付方法</div>
      <div>我的顺丰到付方法我的顺丰到付方法我的顺丰到付方法我的顺丰到付方法我的顺丰到付方法</div>
    </r-marquee>

    <div>123</div>
    <div>123</div>
    <div>123</div>
    <div>123</div>
    <div>Radio2.value {{ Radio2.value }}</div>
    <div>bool.value {{ bool }}</div>
    <!-- <div style="width: 30px; font-size: 80px; height: 1500px; word-wrap: break-word">123456789</div> -->
    <button @click="bool = !bool" disabled>bool</button>
  </div>
</template>
<script setup lang="jsx">
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useListRadio, useListMultiple } from '@rainbow_ljy/v-hooks'
import { ref, onMounted, renderList, h, defineComponent, cloneVNode } from 'vue'
import { setTimeoutPromise } from '@rainbow_ljy/rainbow-js'
import { VRRenderList } from '@rainbow_ljy/v-views'
// list 布局  支持 滚动居中 activite定位 拖拽修改顺序

const RRenderList = defineComponent({
  props: {
    className: String,
    tagName: String,
    tagItemName: String,
    listHook: { type: Object, default: () => ({}) },
  },
  emits: ['change'],
  setup(props, context) {
    return () => {



      async function trigger(item, index) {
        const bool = await props.listHook?.onSelect?.(item, index);
        if (bool) return
        console.log(bool);
        context.emit("change", item, index);
      }

      return renderList(props.listHook.list, (item, index) => {
        const itemNodes = context.slots?.item?.({ item, index })
        let nodes = itemNodes
        if (itemNodes.length === 1 && itemNodes[0].children === null) {
          nodes = itemNodes.map((el) => {
            // console.log(el.props)
            return h(el.type, {
              disabled: props.listHook?.formatterDisabled?.(item, index),
              ...el.props,
              class: [
                el.props.class,
                'select-item',
                props.listHook?.same?.(props.listHook.list[index + 1], index + 1) && 'select-item-prve',
                props.listHook?.same?.(item, index) && 'select-item-checked',
                props.listHook?.same?.(props.listHook.list[index - 1], index - 1) && 'select-item-next',
                props.listHook?.formatterDisabled?.(item, index) && 'select-item-disabled',
              ],
              onClick: (e) => trigger(item, index)
            }, [
              props.listHook?.formatterLabel?.(item, index),
            ])
          })
        }
        return nodes
      })

    }
  },
})

const d = arrayLoopMap(10, (value) => ({
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

const Radio2 = useListRadio({
  value: 3, list: d, formatterDisabled: (item) => {
    return item?.value === 8
  }
})

function change(params) {
  console.log('change')
  console.log(params)
}

function setH() {
  Radio2.updateValue(1)
}
</script>

<style lang="scss">
.select-item {
  cursor: pointer;
}

.select-item-checked {
  color: rgba(255, 255, 255, 0.255);
  background: rgba(0, 0, 0, 0.255);
}

.select-item-disabled {
  cursor: not-allowed;
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




}
</style>
