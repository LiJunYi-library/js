<template>
  <r-falls class="my-falls">
    <template v-for="(item, index) in falls" :key="item.id">
      <div class="item" :class="'item' + index" @click="onItemClick(item)">
        <div>{{ item.title }}</div>
      </div>
    </template>
  </r-falls>
</template>

<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { ref } from 'vue'

const d = arrayLoopMap(10, (value) => ({
  value,
  id: Math.random(),
  title: arrayLoopMap(Math.floor(Math.random() * 60 + 1), () => "瀑布流item").join(""),
}));

const falls = ref(d);

function onItemClick(item) {
  item.title = item.title + '瀑布流item'
}


</script>

<style scoped>


.my-falls {
  --r-columns: 2;
  --r-row-gap: 8px;
  --r-column-gap: 18px;
}

.item {
  background: rgb(243, 243, 243);
}
</style>
