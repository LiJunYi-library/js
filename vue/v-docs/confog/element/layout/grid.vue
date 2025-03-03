<template>
  <r-grid class="my-grid">
    <template v-for="(item, index) in falls" :key="item.id">
      <div class=" item" :class="'item' + index">
        <div>{{ item.value }}</div>
        <div>{{ item.title }}</div>
      </div>
    </template>
  </r-grid>
</template>

<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'

const falls = arrayLoopMap(10, (value) => ({
  value,
  id: Math.random(),
  title: arrayLoopMap(Math.floor(Math.random() * 10), () => "宫格布局").join(""),
}));


</script>

<style scoped>
.my-grid {
  --r-columns: 2;
  --r-column-gap: 10px;
  --r-row-gap: 20px;
}

.item {
  background: rgb(243, 243, 243);
}

.grid-item {
  /* height: 50px; */
}
</style>
