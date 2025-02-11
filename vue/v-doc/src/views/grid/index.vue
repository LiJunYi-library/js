<template>
  <div class="page" :class="name">
    <r-scroll>
      <div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
      </div>


      <VirtualGridList v-model="List">
        <template #default="{ item, index, key }">
          <div @click="changeIndex(index)">{{ item.value }}</div>
          <div> {{ key }}</div>
        </template>
      </VirtualGridList>


      <div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
        <div>五五</div>
      </div>
    </r-scroll>







  </div>
</template>
<script setup lang="jsx">
import { arrayLoopMap, ListArray } from '@rainbow_ljy/rainbow-js';
import { useRadio2 } from '@rainbow_ljy/v-hooks';
import { ref, render, defineComponent, toRaw, watch } from 'vue'
import VirtualGridList from './VirtualGridList.vue'


const name = ref('bottom-center');
const bool = ref(true);
const arr = arrayLoopMap(500000, (value) => ({ value, id: Math.random() }))
const List = ref(arr)
const gap = ref(10);
const columns = ref(4);
const styles = ref([]);


styles.value[0] = { left: '20px' }

styles.value[0] = { left: '40' }

function refresh(params) {
  return new Promise(re => setTimeout(re, 2000))
}

const radio = useRadio2({ list: arrayLoopMap(100, (value) => ({ value: 'v' + value, label: value + '*' })) })

function scroll(params) {
  // console.log('scroll', params);
}


function changeIndex(index) {
  // console.log(index);
  List.value.splice(index, 1, { value: 9999, id: Math.random() })
}

watch(() => List.value.length, () => {
  console.log('watch', 'watch');
})


setTimeout(() => {
  // bool.value = false
  name.value = 'right-bottom'
  gap.value = false
  columns.value = 5

  List.value.push(...arrayLoopMap(15, (value) => ({ value, id: Math.random() })))
}, 4000);

</script>

<style>
.page {
  font-size: 30px;
}

.long {
  width: 30px;
  font-size: 100px;
  background: linear-gradient(45deg, red, blue);
  text-wrap: wrap;
  word-wrap: break-word;
}

.r-grid-item {
  background: gold;
}

.r-scroll-fixed {
  height: 50px;
  background: cyan;
}

.r-scroll-fixed-fixed {
  /* background: rgb(0, 85, 255); */
}

.my-grid {
  --r-columns: r-attr(r-columns);
  --r-row-gap: 20px;
  --r-gap: calc(var(--r-row-gap) + 2vw / 4px);

  /* --r-min-auto-width: 100px; */
  --r-grid-wrap: wrap;
  --r-grid-stretch: stretch;
}

.my-grid div {
  background: yellow;
}

.bottom-center .my-grid {
  /* --r-columns: 9; */
}

.right-bottom .my-grid {
  /* --r-columns: 6; */
}

.r-scroll-virtual-grid-list-item {
  background: rgb(179, 255, 0);
}

/* .dsk {
    width: calc(100vw - 50px);
}

.page .dsk {
    --r-absolute: top;
    flex-wrap: wrap;
    column-width: 30px;

} */
</style>
