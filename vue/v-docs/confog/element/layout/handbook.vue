<template>
  <div class="handbook">
    <r-falls>
      <template v-for="(item, index) in falls" :key="item.id">
        <div class="item" :class="'item' + index">
          <div>{{ item.title }}</div>
        </div>
      </template>
    </r-falls>

    <r-grid class="my-grid">
      <template v-for="(item, index) in falls" :key="item.id">
        <div class="grid-item item" :class="'item' + index">
          <div>{{ item.value }}</div>
        </div>
      </template>
    </r-grid>
  </div>

</template>

<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'

const falls = arrayLoopMap(10, (value) => ({
  value,
  id: Math.random(),
  title: arrayLoopMap(Math.floor(Math.random() * 60), () => "瀑布流item").join(""),
}));


</script>

<style scoped>
.handbook {
  --r-gap: 10px;
  --r-row-gap: 20px;
}

.my-grid{
  --r-columns:2;
}

.item{
  background: rgb(243, 243, 243);
}

.grid-item{
  height: 50px;
}
</style>
