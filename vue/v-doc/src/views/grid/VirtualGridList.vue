<template>
  <r-scroll-virtual-grid-list :ref="onRef" v-model="props.modelValue" @renderList="onRenderList" />
</template>

<script setup lang="jsx">
import { render, defineComponent } from 'vue'

const slots = defineSlots();
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  keyExtractor: { type: Function, default: (val) => val.item.id },
})

const Item = defineComponent({
  props: {
    event: Object,
    slots: Object
  },
  setup(props) {
    return () => {
      return <div class="r-scroll-virtual-grid-list-item-content" >{props?.slots?.default?.(props.event)}</div>
    }
  }
})

function onRef(el) {
  el.keyExtractor = props.keyExtractor
}

function onRenderList(event) {
  // console.log(event);
  render(<Item event={event} slots={slots} key={props.keyExtractor(event)} data-key={props.keyExtractor(event)}></Item>, event.ele)
}

</script>

<style>
.r-scroll-virtual-grid-list-item-content{
  height: 100%;
  box-sizing: border-box;
}
</style>
