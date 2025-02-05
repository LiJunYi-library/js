<template>
  <r-scroll-virtual-grid-list ref="virtualList" v-model="props.modelValue" @renderList="onRenderList" />
</template>

<script setup lang="jsx">
import { ref, render, defineComponent, watch } from 'vue'

const slots = defineSlots();
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
})

const Item = defineComponent({
  props: {
    item: Object,
    index: Number,
    slots: Object
  },
  setup(props) {
    return () => {
      return <div class="r-scroll-virtual-grid-list-item-content" >{props?.slots?.default?.(props)}</div>
    }
  }
})

const virtualList = ref('virtualList')

function onRenderList(event) {
  render(<Item item={event.item} index={event.index} slots={slots}></Item>, event.ele)
}

watch(() => props.modelValue.length, () => {
  virtualList.value.$$.layout();

})


</script>
