<template>
  <r-scroll-virtual-grid-list v-model="list" :onrenderItems="onRenderItems" :keyExtractor="props.keyExtractor">
    <slot></slot>
  </r-scroll-virtual-grid-list>
</template>

<script setup lang="jsx">
import { render, defineComponent, computed, toRaw } from "vue";

const slots = defineSlots();
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  keyExtractor: { type: Function, default: (val) => val.item },
  listHook: { type: Object, default: () => ({}) },
});

const list = computed({
  set(val) {
    if (props.listHook.list) return (props.listHook.list = val);
    emit("update:modelValue", val);
  },
  get() {
    if (props.listHook.list) return props.listHook.list;
    return toRaw(props.modelValue);
  },
});

const refList = computed(() => {
  if (props.listHook.list) return props.listHook.list;
  return props.modelValue;
});

const Item = defineComponent({
  inheritAttrs: false,
  props: {
    event: Object,
    slots: Object,
  },
  setup(props) {
    return () => {
      return props?.slots?.item?.(props.event);
    };
  },
});

function onRenderItems(event) {
  event.item = refList.value[event.index];
  render(
    <Item
      event={event}
      slots={slots}
      key={props.keyExtractor(event)}
      data-key={props.keyExtractor(event)}
    ></Item>,
    event.ele,
  );
}
</script>
