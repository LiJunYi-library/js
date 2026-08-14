<template>
  <r-scroll-virtual-falls-list
    ref="listEle"
    v-model="list"
    :onrenderItems="onRenderItems"
    :keyExtractor="props.keyExtractor"
  >
    <slot></slot>
  </r-scroll-virtual-falls-list>
</template>
<script setup lang="jsx">
import { render, defineComponent, computed, toRaw, ref, watch } from "vue";

const slots = defineSlots();
const listEle = ref(null);
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  keyExtractor: { type: Function, default: (val) => val.item },
  listHook: { type: Object, default: () => ({}) },
});

const list = computed(() => {
  if (props.listHook.list) return toRaw(props.listHook.list);
  return toRaw(props.modelValue);
});

const refList = computed(() => {
  if (props.listHook.list) return props.listHook.list;
  return props.modelValue;
});

watch(refList, () => {
  listEle.value?.$$?.layout?.();
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
    />,
    event.ele,
  );
}
</script>
