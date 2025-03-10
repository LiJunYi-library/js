<template>
  <r-tabs :value="listHook.value" v-bind="{ ...$attrs }">
    <template v-for="(item, index) in listHook?.list ?? []" :key="keyExtractor(item, index)">
      <r-tab-item
        :trigger="trigger"
        :value="listHook?.formatterValue?.(item, index)"
        class="v-r-tab-item"
        :class="'v-r-tab-item' + index"
        @click="listHook?.onSelect?.(item, index)"
      >
        <slot :item="item" :index="index"> {{ listHook?.formatterLabel?.(item, index) }}</slot>
      </r-tab-item>
    </template>
    <slot name="active"></slot>
  </r-tabs>
</template>

<script setup>
const props = defineProps({
  trigger: { type: String, default: "click" },
  keyExtractor: { type: Function, default: (item, index) => index },
  listHook: { type: Array, default: () => ({}) },
});
</script>
