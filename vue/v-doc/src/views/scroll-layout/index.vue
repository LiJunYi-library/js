<template>
  <div class="scroll-demo">
    <r-scroll @scroll="scroll">
      <div><button @click="bottomVisible = true">kaiq</button></div>
      <div v-if="bool">{{ text }}</div>
      <button @click="bool = !bool">bool</button>
      <div>{{ text }}</div>
    </r-scroll>
    <Teleport to="body">
      <r-dialog v-model="bottomVisible" class="my-bottom-dialog" closeOnPopstate>
        <div class="my-dialog-content">
          <div style="height: 500px; overflow: auto; background: white; width: 80vw">
            <div style="height: 200vh">bottom</div>
            <div style="height: 200vh">bottom</div>
          </div>
          <button @click="bottomVisible = false">关闭</button>
        </div>
      </r-dialog>
    </Teleport>
  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { useRadio2 } from '@rainbow_ljy/v-hooks'
import { ref, onMounted } from 'vue'
import { promiseSetTimeout } from '@rainbow_ljy/rainbow-js'

const text = arrayLoopMap(300, () => '帅').join('')
const bottomVisible = ref(false)
const bool = ref(true)

function scroll(events) {
  console.log(events)
}
</script>

<style lang="scss">
.scroll-demo {
  font-size: 80px;
}
</style>
