<template>
  <r-scroll-virtual-grid-list :ref="onRef" v-model="list" @renderList="onRenderList" />
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
    if (props.listHook.list) return props.listHook.list = val;
    emit("update:modelValue", val);
  },
  get() {
    if (props.listHook.list) return props.listHook.list;
    return toRaw(props.modelValue);
  },
});

const refList = computed(()=>{
  if (props.listHook.list) return props.listHook.list;
  return props.modelValue;
})

const Item = defineComponent({
  props: {
    event: Object,
    slots: Object,
  },
  setup(props) {
    return () => {
      return (
        <div class="r-scroll-virtual-grid-list-item-content">
          {props?.slots?.default?.(props.event)}
        </div>
      );
    };
  },
});

function onRef(el) {
  if (el) el.keyExtractor = props.keyExtractor;
}

function onRenderList(event) {
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

<style>
.r-scroll-virtual-grid-list-item-content {
  height: 100%;
  box-sizing: border-box;
}
</style>
