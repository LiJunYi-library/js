<template>
  <div>
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
    <RRenderList :listHook="Radio2" tagName="r-tab" tagItemName="r-tab-item" />

    <div>123</div>
    <div>123</div>
    <div>123</div>
    <div>123</div>
    <div>Radio2.value {{ Radio2.value }}</div>
    <div style="width: 30px; font-size: 80px; height: 1500px; word-wrap: break-word">123456789</div>
    <button @click="bool = !bool">bool</button>
  </div>
</template>
<script setup lang="jsx">
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useRadio2 } from '@rainbow_ljy/v-hooks'
import { ref, onMounted, renderList, h, defineComponent } from 'vue'
import { setTimeoutPromise } from '@rainbow_ljy/rainbow-js'
import { VRTabs } from '@rainbow_ljy/v-views'

const RRenderList = defineComponent({
  props: {
    className: String,
    tagName: String,
    tagItemName: String,
    listHook: { type: Object, default: () => ({}) },
  },
  setup(props, context) {
    return () => {
      return h(
        props.tagName,
        {
          ...context.attrs,
          class: props.className,
          value: props.listHook.value,
        },
        renderList(props.listHook.list, (item, index) => {
          return h(
            props.tagItemName,
            {
              value: props.listHook?.formatterValue?.(item, index),
              class: props.className + '-item',
            },
            [props.listHook?.formatterLabel?.(item, index)],
          )
        }),
      )
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

const Radio2 = useRadio2({ value: 3, list: d })

function change(params) {
  console.log('change')
  console.log(params)
}

function setH() {
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

.vertical-tab {
  width: 150px;
  height: 200px;
}
</style>
