<template>
  <div :class="name" class="r-grid-demo">
    <div>
      <button @click="bool = !bool">bool</button>
      <button @click="text = cText()">text</button>
    </div>

    <r-grid>
      <div>五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五</div>
      <div>
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
      </div>
      <div>
        修改 {{ text }}
      </div>
      <div>
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
      </div>
      <div v-if="bool">
        六六六六六六六六六六六六六六六六六六六六六六六六六六六六六六六六六六六六六六六六六六六六六六
        六六六六六六六六六六六六六六六六六六六六六六六六六六
      </div>
      <div>五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五</div>
      <div>
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
      </div>
      <div>
        修改 {{ text }}
      </div>
      <div>五五五五五五五五五五五五五五五</div>
      <div>
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
      </div>
      <div>
        五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五五
      </div>
    </r-grid>

    <r-grid class="min-auto-width">
      <template v-for="(item, index) in list">
        <div>
          {{ item.text }}
        </div>
      </template>
    </r-grid>

  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { ref } from 'vue'
const bool = ref(true);
const cText = () => arrayLoopMap(Math.floor(Math.random() * 100), (i) => '我').join('');
const text = ref(cText())
const name = ref('bottom-center')
const list = arrayLoopMap(10, () => ({ text: cText() }))
</script>

<style scoped lang="scss">
.r-grid-demo {
  r-grid {
    --r-columns: 3;
    --r-gap: 10px;
    --r-row-gap: 10px;
    --r-column-gap: 20px;
  }


  .min-auto-width {
    --r-min-auto-width: 200px;
  }

}
</style>
