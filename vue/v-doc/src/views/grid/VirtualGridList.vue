<template>
  <r-scroll-virtual-grid-list  v-model="props.modelValue" @renderList="onRenderList" />
</template>

<script setup lang="jsx">
import { ref, render, defineComponent, watch, onMounted } from 'vue'

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

function onRenderList(event) {
  render(<Item item={event.item} index={event.index} slots={slots}></Item>, event.ele)
}

</script>
