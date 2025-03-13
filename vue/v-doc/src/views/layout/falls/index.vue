<template>
  <div :class="name" class="falls-demo">
    <div>
      <button @click="bool = !bool">bool</button>
      <button @click="text = cText()">text</button>
    </div>

    <r-falls>
      <div>五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五</div>
      <div>
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
      </div>
      <div>
        {{text  }}
      </div>
      <div>
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
      </div>
      <div v-if="bool">
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
      </div>
      <div>五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五</div>
      <div>
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
      </div>
      <div>五五五五五五五五五五五五五五五</div>
      <div>
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
      </div>
      <div>
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
      </div>
    </r-falls>

  </div>
</template>
<script setup>
import { arrayLoopMap, ListArray } from '@rainbow_ljy/rainbow-js'
import { useRadio2 } from '@rainbow_ljy/v-hooks'
import { ref } from 'vue'
import { useFetch } from '@/utils/request'
const bool = ref(true);
const cText = () => arrayLoopMap(Math.floor(Math.random() * 100), (i) => '我').join('');
const text = ref(cText())


const spuList = useFetch({
  url: 'https://spu.manmanbuy.com/spu/list',
  method: 'post',
  body: { page: 1, rows: 1000 }
})

const name = ref('bottom-center')
const arrays = new ListArray()
// arrays.push(
//   ...arrayLoopMap(10, (value) => ({
//     value,
//     id: Math.random(),
//     title: arrayLoopMap(Math.floor(Math.random() * 100), (i) => '我').join(''),
//   })),
// )
const List = ref([])
const gap = ref(10)
const columns = ref(4)

const styles = ref([])

styles.value[0] = { left: '20px' }

styles.value[0] = { left: '40' }
function refresh(params) {
  return new Promise((re) => setTimeout(re, 2000))
}

function changeIndex(index) {
  // console.log(index);
  List.value.splice(index, 1, { value: 9999, id: Math.random() })
}

const radio = useRadio2({
  list: arrayLoopMap(100, (value) => ({ value: 'v' + value, label: value + '*' })),
})

function scroll(params) {
  // console.log('scroll', params);
}
setTimeout(async () => {
  await spuList.nextSend();
  const d = (spuList.data?.records ?? []);
  List.value.push(...d)
}, 0)

// setTimeout(() => {
//   // bool.value = false
//   name.value = 'right-bottom'
//   gap.value = false
//   columns.value = 5
// }, 4000)
</script>

<style scoped lang="scss">
.falls-demo {
  r-falls {
    --r-columns: 3;
    --r-gap: 10px;
    --r-row-gap: 10px;
    --r-column-gap: 20px;
  }

  .r-falls-item {
    // transition: 0.25s;
  }

}
</style>
