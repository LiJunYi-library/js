<template>
  <r-scroll-virtual-falls-list :ref="onRef" v-model="list" @renderList="onRenderList" />
</template>

<script setup lang="jsx">
import { render, defineComponent, toRaw, computed } from 'vue'

const slots = defineSlots();
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  keyExtractor: { type: Function, default: (val) => val.item.id },
})

const list = computed({
  set(val) {
    emit("update:modelValue", val);
  },
  get() {
    return toRaw(props.modelValue)
  }
})

const Item = defineComponent({
  props: {
    event: Object,
    slots: Object
  },
  setup(props) {
    return () => {
      return <div class="r-scroll-virtual-falls-list-item-content" >{props?.slots?.default?.(props.event)}</div>
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
.r-scroll-virtual-falls-list-item-content {}
</style>
