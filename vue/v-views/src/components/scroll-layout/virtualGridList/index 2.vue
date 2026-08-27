<template>
  <r-scroll-virtual-grid-list
    ref="listEle"
    v-model="list"
    :onrenderItems="onRenderItems"
    :keyExtractor="props.keyExtractor"
  >
    <slot></slot>
  </r-scroll-virtual-grid-list>
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

// deep: true 才能覆盖 splice 等长替换、arr[i]=x、sort/reverse 等 length 不变的修改;
// push/pop/splice 等 length 变化自然也包含在内
watch(
  refList,
  () => {
    listEle.value?.$$?.layout?.();
  },
  { deep: true },
);

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
